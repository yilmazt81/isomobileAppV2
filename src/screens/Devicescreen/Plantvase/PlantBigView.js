import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';

import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Switch, Button, Card, IconButton } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Config from 'react-native-config';
import { useTranslation } from 'react-i18next';
import mqtt from 'mqtt';
import { getMoistureIcon, getSoilMoistureLevel } from './iconfunctions';
import StatusCard from './StatusCard';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Slider from '@react-native-community/slider';
//import storage from '@react-native-firebase/storage';

import firestore from '@react-native-firebase/firestore';
import styles from './PlantBigViewStyle';
import ErrorMessage from '../../../companent/ErrorMessage';
import mqttService from '../../../lib/mqttService';

import TaskEditor from '../../../companent/TaskEditor';
import DurationDlg from '../../../companent/DurationDlg';

const PlantBigView = () => {
    const route = useRoute();
    const [response, setResponse] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { t, i18n } = useTranslation();
    const { deviceid = '', devicename = '', userid = "", firebasedocumentid = "" } = route.params || {};
    const [message, setMessage] = useState(t("Connecting"));
    const [errorMessage, setErrorMessage] = useState(null);
    const [initialPompTask, setinitialPompTask] = useState(null);
    const [client, setClient] = useState(null);
    /*
        const [temperature, setTemperature] = useState(0);
        const [airHumidity, setAirHumidity] = useState(0);
        */
    const [soil_moisture, setSoilMoisture] = useState(0);
    const [icon, seticon] = useState(null);
    const [connected, setConnected] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [transferred, setTransferred] = useState(0);
    const [pompRunning, setpompRunning] = useState(false);
    const [isPompOpen, setIsPompOpen] = useState(false);
    const clientRef = useRef(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const defaultDuration = 30;
    const [durationDlg, setDurationDlg] = useState({ open: false, pump: 1, value: String(defaultDuration) });
    const [pompRemaining, setpompRemaining] = useState(0);
    const onPictureButtonPress = () => {
        Alert.alert(
            t("ImageSource"),
            t("WhichSourceDoyouWant"),
            [
                {
                    text: t("Camera"),
                    onPress: () => openCamera()
                },
                {
                    text: t("Galery"),
                    onPress: () => openGallery()
                },
                { text: t("Cancel"), style: "cancel" }
            ]
        );
    };
    const openCamera = () => {
        launchCamera({ mediaType: 'photo' }, (response) => {
            if (response.didCancel || !response.assets) return;
            const uri = response.assets[0].uri;
            setImageUri(uri);
            uploadImage(uri);
        });
    };

    const openGallery = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel || !response.assets) return;
            const uri = response.assets[0].uri;
            setImageUri(uri);
            uploadImage(uri);
        });
    };


    const connectMqtt = () => {
        var topicsensor = deviceid + '/sensorData';
        var statusTopic = deviceid + '/status';
        setErrorMessage(null);
        if (Config.mqttwebsocket === undefined) {
            setErrorMessage("config Cannot read");
            return;
        }
        clientRef.current = mqtt.connect(Config.mqttwebsocket, {
            port: Config.mqttWebSocketport,
            clientId: userid,
            username: Config.mqtt_username,    // eğer auth varsa
            password: Config.mqtt_password,    // eğer auth varsa
            rejectUnauthorized: false, // self-signed cert için
        });

        clientRef.current.on('connect', () => {
            console.log('WSS MQTT bağlandı');
            setMessage(t("Connected"));
            setConnected(true);
            setClient(client);
            clientRef.current.subscribe(topicsensor);
            clientRef.current.subscribe(statusTopic);
        });

        clientRef.current.on('message', (topic, msg) => {
            setMessage(null);
            if (topic === topicsensor) {
                var jsonData = JSON.parse(msg.toString());
                setSoilMoisture(jsonData.soil_moisture);
                var icon_ = getMoistureIcon(getSoilMoistureLevel(jsonData.soil_moisture));
                console.log(icon_);
                seticon(icon_);
            }

            var message = msg.toString();

            setMessage(null);


            if (topic === statusTopic) {

                const arr = message.split('|');
                debugger;
                if (arr.length === 3) {

                    if (arr[0] === "pompstatus") {

                        setpompRunning(arr[2] === "1");

                    }
                }

            }
        });

        clientRef.current.on('error', err => {
            console.log('MQTT WSS HATA:', err);
            setErrorMessage(t("ConnectionError"), err.message);
            setConnected(false);
        });

        return () => {
            clientRef.current.end();
        };

    }

    const StartPomp = async (time) => {


        setpompRunning(false);
        if (!client) {
            console.warn('MQTT client henüz bağlanmadı.');
            return;
        }
        var topiccommand = deviceid + '/command';

        const command = {
            command: 'water',
            value: 1,
            time: time
        };

        client.publish(topiccommand, JSON.stringify(command), { qos: 1, retain: false }, (error) => {
            if (error) {
                console.error('Publish Hatası:', error);
                setErrorMessage('Publish Hatası:', error);

            } else {
                console.log('Komut gönderildi:', command);
                //setIsPompOpen(true);
            }
        });

    };


    const uploadImage = async (uri) => {


        /* const filename = uri.substring(uri.lastIndexOf('/') + 1);
         const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
 
         setUploading(true);
         setTransferred(0);
 
         const task = storage()
             .ref(filename)
             .putFile(uploadUri);
         debugger;
         // set progress state
         task.on('state_changed', snapshot => {
             setTransferred(
                 Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
             );
         });
 
         try {
             await task;
         } catch (e) {
             console.error(e);
             setErrorMessage(e.message);
         }
 
         setUploading(false);
         Alert.alert(
             'Photo uploaded!',
             'Your photo has been uploaded to Firebase Cloud Storage!'
         );
 
         setImageUri(null);
         */
    };



    const getDevice = async () => {
        try {

            const docRef = firestore().collection('Device').doc(firebasedocumentid); // koleksiyon ve doküman id
            const docSnap = await docRef.get();

            if (docSnap._exists) {
         
                var data = docSnap._data;
                 
                var days = data?.PompWorkingDays
                    ? String(data.PompWorkingDays)
                        .split(",")
                        .map((x) => x.trim())           // boşlukları sil
                        .filter((x) => x !== "")        // boşları at
                        .map((x) => parseInt(x, 10))    // int’e çevir
                        .filter((n) => !isNaN(n))       // NaN olanları at
                    : []
                setinitialPompTask({
                    pompnumber: 1,
                    enabled: data?.pomp,
                    nextRun: (data?.PompWorkingnextRun == null ? new Date() : new Date(data?.PompWorkingnextRun)),
                    repeat: { type: data?.PompWorkingPeriod, days: days },
                    durationValue: data?.PompWorkingDuration,
                });

            } else {
                console.log("Böyle bir doküman yok!");
                setErrorMessage("Böyle bir doküman yok!");
            }
        } catch (error) {
            debugger;
            console.error("Doküman okunamadı: ", error);
            setErrorMessage(error.message);
        }
    };
    useEffect(() => {


        const pingInterval = setInterval(() => {
            const c = mqttService.getClient();
            if (c && c.connected) {
                c.publish(`${deviceid}/ping`, 'ping', { qos: 0, retain: false });
            }
        }, 10000); // 10 saniyede bir ping
        (async () => {
            await getDevice();
            cleanup = connectMqtt();   // connectMqtt cleanup döndürüyor
            await requestPermission();

        })();
        return () => {

            clearInterval(pingInterval);
            if (typeof cleanup === 'function') cleanup();
        };


    }, []);

  

    const changePompStatus = async (status) => {

        setIsPompOpen(status);
        await UpdatePompStatus({ pomp: status });

    }

    const UpdatePompStatus = async (data) => {
        try {
            await firestore()
                .collection('Device')
                .doc(firebasedocumentid) // doküman ID
                .update(data);
            console.log('Güncelleme başarılı!');
        } catch (error) {
            console.error('Update hatası: ', error);
            setErrorMessage(error.message);
        }
    };
    const handlePump = async () => {
        await StartPomp(5);
    };


    const updatePompTask = async (task) => {


        var workingDays = "";
        if (task.repeat.type === "weekly") {
            for (let i = 0; i < task.repeat.days.length; i++) {

                workingDays += task.repeat.days[i] + ",";

            }
        }

        var updatedata = {
            PompWorkingHour: task.nextRun.getHours(),
            PompWorkingMinute: task.nextRun.getMinutes(),
            PompWorkingPeriod: task.repeat.type,
            PompWorkingDays: workingDays,
            PompWorkingDuration: task.durationValue,
            PompWorkingnextRun: task.nextRun.toString()
        };
        UpdatePompStatus(updatedata);



        setEditorOpen(false);
        await sendSettingToDevice();
    }

    const sendSettingToDevice = async () => {

        try {
            const docRef = firestore().collection('Device').doc(firebasedocumentid); // koleksiyon ve doküman id
            const docSnap = await docRef.get();

            if (docSnap.exists) {
                console.log("Kullanıcı verisi:", docSnap.data());
                var data = docSnap.data();

                const command = {
                    command: 'SaveSetting',
                    pEn: data?.pomp,
                    PSH: data?.PompWorkingHour,
                    PSM: data?.PompWorkingMinute,
                    PRT: data?.PompWorkingPeriod,
                    PWWD: data?.PompWorkingDays,
                    P1WT: data?.PompWorkingDuration,
                    DLat: data?.devicelatitude,
                };
                sendCommandToDevice(command);
            } else {
                console.log("Böyle bir doküman yok!");
            }
        } catch (error) {
            console.error("Doküman okunamadı: ", error);
            setErrorMessage(error.message);
        }

    }

    const sendCommandToDevice = async (command) => {
        const mqttClient = mqttService.getClient();
        setErrorMessage(null);

        if (!mqttClient) {
            console.warn('MQTT client henüz bağlanmadı.');
            setErrorMessage("MQTT client henüz bağlanmadı.")
            return;
        }
        var topic = deviceid + '/command';

        mqttClient.publish(topic, JSON.stringify(command), { qos: 1, retain: false }, (error) => {

            if (error) {
                console.error('Publish Hatası:', error);

                setErrorMessage(`Publish Hatası: ${error.message}`);
            }
        });
    }

    const openTaskCreate = async () => {

        await getDevice();
        setEditorOpen(true);
    };
    return (

        <LinearGradient colors={['#090979', '#00D4FF', '#020024']} style={styles.container}>
 
            <Card style={styles.container}>
                <ScrollView>
                    <View style={styles.imageContainer}>
                        <Image
                            source={imageUri ? { uri: imageUri } : require('./Plant.jpg')}
                            style={styles.image}
                        />
                        <TouchableOpacity style={styles.editIcon} onPress={onPictureButtonPress}>
                            <MaterialDesignIcons name="image-edit" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.name}> {devicename} </Text> 
                    </View>
                    <StatusCard icon={icon} 
                        soil_moisture={soil_moisture}
                        t={t}
                    ></StatusCard>
                    <View style={styles.grid}>
                        <View style={styles.cell}>
                            <IconButton
                                icon={pompRunning ? "water-pump" : "play-circle-outline"}
                                size={40}
                                onPress={() => handlePump()}
                                onLongPress={() => openDurationFor()}

                                style={[styles.pumpBtn, { borderColor: "#00BFA5" }, isPompOpen && { borderWidth: 0 }]}
                                containerColor={isPompOpen ? "#00BFA5" : undefined}
                                iconColor={isPompOpen ? "white" : "#00BFA5"}
                                disabled={!isPompOpen}
                            />
                            <Text style={styles.pumpLabel}>{isPompOpen ? `${pompRemaining}s` : "Pompa 1"}</Text>

                            <Switch value={isPompOpen} onValueChange={(e) => changePompStatus(e)} />
                        </View>

                        <View style={styles.cell}>
                            <IconButton icon="calendar-clock"
                                size={34}
                                disabled={!isPompOpen}
                                onPress={() => openTaskCreate()}
                            />
                        </View>
                    </View>
  
                    <DurationDlg

                        duration={durationDlg}
                        closeDuration={() => setDurationDlg({ ...durationDlg, open: false, value: String(defaultDuration) })}

                        defaultDuration={defaultDuration}
                        confirmDuration={(e, t) => handlePump(e, t)}
                        errorMessage={errorMessage}
                    ></DurationDlg>

                    <TaskEditor
                        visible={editorOpen}
                        defaultDuration={defaultDuration}
                        onDismiss={() => setEditorOpen(false)}
                        pomp={1}
                            
                        onSave={(e) => updatePompTask(e)}
                        initial={initialPompTask}
                        t={t}
                    />



                    {pompRunning ?
                        <LottieView
                            source={require('../../assets/water.json')}
                            autoPlay
                            loop
                            style={styles.lottie}
                        /> : null}
                    <ErrorMessage message={errorMessage}></ErrorMessage>
                </ScrollView>
            </Card>
        </LinearGradient>
    );
}

export default PlantBigView;


import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView, PermissionsAndroid, Platfor, Platform } from 'react-native';

import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Config from 'react-native-config';
import { useTranslation } from 'react-i18next';
import mqtt from 'mqtt';
//import { getMoistureIcon, getSoilMoistureLevel } from './iconfunctions';
//import StatusCard from './StatusCard';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './PlantBigViewPompStyle';
import firestore from '@react-native-firebase/firestore';
import storage, { updateMetadata } from '@react-native-firebase/storage';
import ErrorMessage from '../../../companent/ErrorMessage';
import TaskEditor from '../../../companent/TaskEditor';
import DurationDlg from '../../../companent/DurationDlg';

import {
    Appbar,
    Avatar,
    Button,
    Card,
    Chip,
    Dialog,
    Divider,
    FAB,
    IconButton,
    Menu,
    Modal,
    Portal,
    Searchbar,
    SegmentedButtons,
    Surface,
    Switch,
    Text,
    useTheme,
    Icon
} from "react-native-paper";

import mqttService from '../../../lib/mqttService';
import Geolocation from "react-native-geolocation-service";

const PlantBigViewPomp = () => {
    const route = useRoute();
    const [response, setResponse] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);
    const [location, setLocation] = useState(null);
    const { t, i18n } = useTranslation();
    const { deviceid = '', devicename = '', userid, firebasedocumentid } = route.params || {};
    const [message, setMessage] = useState(t("Connecting"));
    const [errorMessage, setErrorMessage] = useState(null);
    const [editing, setEditing] = useState(undefined);
    const [client, setClient] = useState(null);
    const clientRef = useRef(null);
    const [isPomp1Open, setisPomp1Open] = useState(false);
    const [isPomp2Open, setisPomp2Open] = useState(false);
    const [pomp1Remaining, setpomp1Remaining] = useState(0);
    const [pomp2Remaining, setpomp2Remaining] = useState(0);
    const [connected, setConnected] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [transferred, setTransferred] = useState(0);
    const defaultDuration = 30;
    const [durationDlg, setDurationDlg] = useState({ open: false, pomp: 1, value: String(defaultDuration) });
    const [pomp1On, setPomp1On] = useState(false);
    const [pomp2On, setPomp2On] = useState(false);
    const [selectedPomp, setSelectedPomp] = useState(1);
    const [enablegeoLocation, setEnablegeoLocation] = useState(false);
    const [initialPompTask, setinitialPompTask] = useState(null);



    const onPictureButtonPress = () => {
        Alert.alert(
            "Resim Kaynağı",
            "Fotoğrafı nasıl eklemek istersin?",
            [
                {
                    text: "Kamera",
                    onPress: () => openCamera()
                },
                {
                    text: "Galeri",
                    onPress: () => openGallery()
                },
                { text: "İptal", style: "cancel" }
            ]
        );
    };
    const openCamera = () => {
        launchCamera({ mediaType: 'photo' }, (response) => {
            if (response.didCancel || !response.assets) return;
            const uri = response.assets[0].uri;
            debugger;
            setImageUri(uri);
            //Alert.alert(uri);
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
        // var topic = deviceid + '/sensorData';
        var statusTopic = deviceid + '/status';

        setErrorMessage(null);
        console.log(Config);
        if (Config.mqttwebsocket === undefined) {
            setErrorMessage("config Cannot read");
            return;
        }
        clientRef.current = mqttService.connect(userid + "_PompBigView");

        clientRef.current.on('connect', () => {

            console.log('WSS MQTT bağlandı');
            setMessage(t("Connected"));

            setConnected(true);
            // setClient(client);

            // clientRef.current.subscribe(topic);
            clientRef.current.subscribe(statusTopic);
        });

        clientRef.current.on('message', (topic, msg) => {


            var message = msg.toString();

            setMessage(null);


            if (topic === statusTopic) {

                const arr = message.split('|');

                if (arr.length === 3) {
                 
                    if (arr[0] === "pompstatus") {
                        if (arr[1] === "1") {
                            setpomp1On(arr[2] === "1");
                        }

                        if (arr[1] === "2") {
                            setpomp2On(arr[2] === "1");
                        }
                    }
                }

            }
        });

        clientRef.current.on('error', err => {
            console.log('MQTT WSS HATA:', err);
            setErrorMessage(t("ConnectionError"), err.message);
            setConnected(false);
            debugger;
        }); clientRef.current.on('close', () => {
            console.log("MQTT bağlantısı kapandı");
            debugger;
            setConnected(false);
            setTimeout(() => connectMqtt(), 2000); // 2 saniye sonra yeniden bağlan
        });



        return () => {
            try {
                // mqtt.js için doğru kapanış metodu end()'dir; destroy() yok.
                clientRef.current?.end(true); // force=true isteğe bağlı
            } catch (e) {
                console.log('MQTT close error:', e);
            }
        };

    }


    const getLocation = async () => {
        setLocation("Konum Alınıyor...");
        setErrorMessage(null);
        const hasPermission = await requestPermission();
        if (!hasPermission) return;

        Geolocation.getCurrentPosition(
            async (position) => {

                setLocation(position.coords.latitude + "," + position.coords.longitude);
                await UpdatePompStatus({ enableLocation: true, devicelatitude: position.coords.latitude.toString(), devicelongitude: position.coords.longitude.toString() });

            },
            (error) => {
                console.log(error.code, error.message);
                setErrorMessage(error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };
    const StartPomp = async (pompnumber, time) => {
        const mqttClient = clientRef.current || mqttService.getClient();
        setErrorMessage(null);

        if (!mqttClient) {
            console.warn('MQTT client henüz bağlanmadı.');
            setErrorMessage("MQTT client henüz bağlanmadı.")
            connectMqtt();
            return;
        }
        var topic = deviceid + '/command';


        const command = {
            command: 'water',
            value: 1,
            time: time,
            pomp: pompnumber
        };
        mqttClient.publish(topic, JSON.stringify(command), { qos: 1, retain: false }, (error) => {

            if (error) {
                console.error('Publish Hatası:', error);
                debugger;
                setErrorMessage(`Publish Hatası: ${error.message}`);
            } else {
                setDurationDlg({ open: false, pomp: pompnumber, value: String("") });
                if (pompnumber === 1) {
                    setpomp1On(true);
                    setpomp1Remaining(time);

                } else if (pompnumber === 2) {
                    setpomp2On(true);
                    setpomp2Remaining(time);
                }

                //setErrorMessage(`Komut gönderildi: ${JSON.stringify(command)}`);
            }
        });
    };


    const uploadImage = async (uri) => {
        debugger;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        setErrorMessage(null);

        setUploading(true);
        setTransferred(0);

        const task = storage()
            .ref(filename)
            .putFile(uploadUri);

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

        const downloadUrl = await storage().ref(filename).getDownloadURL();
        Alert.alert("Resim Yüklendi", downloadUrl, [{ text: "Tamam" }]);
        console.log("Resim URL:", downloadUrl);
        setImageUri(downloadUrl);
        await UpdatePompStatus({ picture: downloadUrl });
    };


    const requestPermission = async () => {
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.CAMERA,
                {
                    title: t("CameraPermisionTitle"),
                    message: t("CameraPermisionMessage"),
                    buttonNeutral: t("AskMeLater"),
                    buttonNegative: t("Cancel"),
                    buttonPositive: t("OK")
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true; // iOS için
    };

    useEffect(() => {
        let cleanup;
        const pingInterval = setInterval(() => {
            const c = mqttService.getClient();
            if (c && c.connected) {
                c.publish(`${deviceid}/ping`, 'ping', { qos: 0,retain: false });
            }
        }, 10000); // 10 saniyede bir ping

        (async () => {
            await getDevice(0);
            cleanup = connectMqtt();   // connectMqtt cleanup döndürüyor
            await requestPermission();

        })();
        return () => {

            clearInterval(pingInterval);
            if (typeof cleanup === 'function') cleanup();
        };
    }, []);

    const getDevice = async (pmpNumber) => {
        try {
            const docRef = firestore().collection('Device').doc(firebasedocumentid); // koleksiyon ve doküman id
            const docSnap = await docRef.get();

            if (docSnap._exists) {
                //console.log("Kullanıcı verisi:", docSnap.data());

                var data = docSnap._data;

                setisPomp1Open(data?.pomp1);
                setisPomp2Open(data?.pomp2);
                setEnablegeoLocation(data?.enableLocation);

                if (pmpNumber === 1) {
                    var days = data?.Pomp1WorkingDays
                        ? String(data.Pomp1WorkingDays)
                            .split(",")
                            .map((x) => x.trim())           // boşlukları sil
                            .filter((x) => x !== "")        // boşları at
                            .map((x) => parseInt(x, 10))    // int’e çevir
                            .filter((n) => !isNaN(n))       // NaN olanları at
                        : []
                    setinitialPompTask({
                        pompnumber: 1,
                        enabled: data?.pomp1,
                        nextRun: (data?.Pomp1WorkingnextRun == null ? new Date() : new Date(data?.Pomp1WorkingnextRun)),
                        repeat: { type: data?.Pomp1WorkingPeriod, days: days },
                        durationValue: data.Pomp1WorkingDuration,
                    });
                } else if (pmpNumber === 2) {
                    var days = data?.Pomp2WorkingDays
                        ? String(data.Pomp2WorkingDays)
                            .split(",")
                            .map((x) => x.trim())           // boşlukları sil
                            .filter((x) => x !== "")        // boşları at
                            .map((x) => parseInt(x, 10))    // int’e çevir
                            .filter((n) => !isNaN(n))       // NaN olanları at
                        : []
                    setinitialPompTask({
                        pompnumber: 2,
                        enabled: data?.pomp2,
                        nextRun: (data?.Pomp2WorkingnextRun == null ? new Date() : new Date(data?.Pomp2WorkingnextRun)),
                        repeat: { type: data?.Pomp2WorkingPeriod, days: days },
                        durationValue: data?.Pomp2WorkingDuration,
                    });
                }
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


    const openDurationFor = (pompNnumber) => {
        setDurationDlg({ open: true, pomp: pompNnumber, value: String("") });

    };

    const handlepomp1 = async () => {
        await StartPomp(1, 5);
    };

    const openTaskCreate = async (pomp) => {

        await getDevice(pomp);
        setSelectedPomp(pomp);
        setEditorOpen(true);
    };

    const handlepomp2 = async () => {

        await StartPomp(2, 5);
    };


    const handlepomp = async (pomp, time) => {

        await StartPomp(pomp, time);

        setDurationDlg({ open: false, pomp: pomp, value: defaultDuration });

    };



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

    const changePompStatus = async (pompNumber, status) => {

        if (pompNumber === 1) {
            setisPomp1Open(status);
            await UpdatePompStatus({ pomp1: status });
        } else if (pompNumber === 2) {
            setisPomp2Open(status);
            await UpdatePompStatus({ pomp2: status });
        }
    }

    const updatePompTask = async (task) => {


        var workingDays = "";
        if (task.repeat.type === "weekly") {
            for (let i = 0; i < task.repeat.days.length; i++) {

                workingDays += task.repeat.days[i] + ",";

            }
        }
        if (task.pompnumber === 1) {
            var updatedata = {
                Pomp1WorkingHour: task.nextRun.getHours(),
                Pomp1WorkingMinute: task.nextRun.getMinutes(),
                Pomp1WorkingPeriod: task.repeat.type,
                Pomp1WorkingDays: workingDays,
                Pomp1WorkingDuration: task.durationValue,
                Pomp1WorkingnextRun: task.nextRun.toString()
            };
            UpdatePompStatus(updatedata);
        } else {
            var updatedata = {
                Pomp2WorkingHour: task.nextRun.getHours(),
                Pomp2WorkingMinute: task.nextRun.getMinutes(),
                Pomp2WorkingPeriod: task.repeat.type,
                Pomp2WorkingDays: workingDays,
                Pomp2WorkingDuration: task.durationValue,
                Pomp2WorkingnextRun: task.nextRun.toString()
            };

            UpdatePompStatus(updatedata);
        }

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
                    p1En: data?.pomp1,
                    p2En: data?.pomp2,
                    P1SH: data?.Pomp1WorkingHour,
                    P1SM: data?.Pomp1WorkingMinute,
                    P1RT: data?.Pomp1WorkingPeriod,
                    PW1WD: data?.Pomp1WorkingDays,
                    P2SH: data?.Pomp2WorkingHour,
                    P2SM: data?.Pomp2WorkingMinute,
                    PW2WD: data?.Pomp2WorkingDays,
                    P2WT: data?.Pomp2WorkingDuration,
                    P1WT: data?.Pomp1WorkingDuration,
                    UseGeo: data?.enableLocation,
                    DLat: data?.devicelatitude,
                    DLong: data?.devicelongitude,
                    enLoca: data?.enableLocation,
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

    const toggleLocationSwitch = async () => {
        setEnablegeoLocation(enablegeoLocation => !enablegeoLocation);
        if (!enablegeoLocation) {
            await getLocation();
        } else {
            await UpdatePompStatus({ enableLocation: false, devicelatitude: "", devicelongitude: "" });
        }
    }
    return (

        <LinearGradient colors={['#090979', '#00D4FF', '#020024']} style={styles.container}>
            <Card style={styles.container}>
                <ScrollView >
                    <View style={styles.imageContainer}>
                        <Image
                            source={imageUri ? { uri: imageUri } : require('./vases.png')}
                            style={styles.image}
                        />
                        <TouchableOpacity style={styles.editIcon} onPress={onPictureButtonPress}>
                            <MaterialDesignIcons name="image-edit" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.name}>{devicename}</Text>
                    </View>

                    <ErrorMessage message={errorMessage}></ErrorMessage>

                    <Card>
                        <View style={styles.pompcontainer}>
                            <View>

                                <View style={styles.leftContent}>
                                    <Icon name="map-marker" size={28} color="#007AFF" style={{ marginRight: 10 }} />

                                    <Text style={styles.labellocation}>{t("LocationDescription")}</Text>
                                </View>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    thumbColor={enablegeoLocation ? "#007AFF" : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => toggleLocationSwitch()}
                                    value={enablegeoLocation}
                                />
                            </View>
                            <View style={styles.grid}>
                                <View style={styles.cell}>
                                    <IconButton
                                        icon={pomp1On ? "water-pomp" : "play-circle-outline"}
                                        size={40}
                                        onPress={() => handlepomp1()}
                                        onLongPress={() => openDurationFor(1)}

                                        style={[styles.pompBtn, { borderColor: "#00BFA5" }, pomp1On && { borderWidth: 0 }]}
                                        containerColor={pomp1On ? "#00BFA5" : undefined}
                                        iconColor={pomp1On ? "white" : "#00BFA5"}
                                        disabled={!isPomp1Open}
                                    />
                                    <Text style={styles.pompLabel}>{pomp1On ? `${pomp1Remaining}s` : "Pompa 1"}</Text>

                                    <Switch value={isPomp1Open} onValueChange={(e) => changePompStatus(1, e)} />
                                </View>

                                <View style={styles.cell}>
                                    <IconButton icon="calendar-clock"
                                        size={34}
                                        disabled={!isPomp1Open}
                                        onPress={() => openTaskCreate(1)}
                                    />
                                </View>

                                <View style={styles.cell}>
                                    <IconButton
                                        icon={pomp2On ? "water-pomp" : "play-circle-outline"}
                                        size={40}
                                        onPress={() => handlepomp2()}
                                        onLongPress={() => openDurationFor(2)}
                                        style={[styles.pompBtn, { borderColor: "#00BFA5" }, pomp2On && { borderWidth: 0 }]}
                                        containerColor={pomp2On ? "#00BFA5" : undefined}
                                        iconColor={pomp2On ? "white" : "#00BFA5"}
                                        disabled={!isPomp2Open}
                                    />
                                    <Text style={styles.pompLabel}>{pomp2On ? `${pomp2Remaining}s` : "Pompa 2"}</Text>
                                    <Switch value={isPomp2Open} onValueChange={(e) => changePompStatus(2, e)} />
                                </View>

                                <View style={styles.cell}>
                                    <IconButton
                                        icon="calendar-clock"
                                        size={34}
                                        disabled={!isPomp2Open}
                                        onPress={() => openTaskCreate(2)}
                                    />
                                </View>
                            </View>
                        </View>

                    </Card>

                    {
                        /*<TouchableOpacity style={styles.button} onPress={() => setEditorOpen(true)}>
                            <Text style={styles.waterButton}>   {t("StartWaterPomp")}</Text>
                        </TouchableOpacity>*/
                    }


                    <DurationDlg

                        duration={durationDlg}
                        closeDuration={() => setDurationDlg({ ...durationDlg, open: false, value: String(defaultDuration) })}

                        defaultDuration={defaultDuration}
                        confirmDuration={(e, t) => handlepomp(e, t)}
                        errorMessage={errorMessage}
                    ></DurationDlg>

                    <TaskEditor
                        visible={editorOpen}
                        defaultDuration={defaultDuration}
                        onDismiss={() => setEditorOpen(false)}
                        pomp={selectedPomp}

                        onSave={(e) => updatePompTask(e)}
                        initial={initialPompTask}
                        t={t}
                    />
                </ScrollView>
            </Card >
        </LinearGradient >
    );
}

export default PlantBigViewPomp;

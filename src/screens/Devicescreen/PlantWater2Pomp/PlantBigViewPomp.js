import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';

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
} from "react-native-paper";

import mqttService from '../../../lib/mqttService';


const PlantBigViewPomp = ({ navigation }) => {
    const route = useRoute();
    const [response, setResponse] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);

    const { t, i18n } = useTranslation();
    const { deviceid = '', devicename = '', userid, firebasedocumentid } = route.params || {};
    const [message, setMessage] = useState(t("Connecting"));
    const [errorMessage, setErrorMessage] = useState(null);
    const [editing, setEditing] = useState(undefined);
    const [client, setClient] = useState(null);
    const clientRef = useRef(null);
    const [isPomp1Open, setisPomp1Open] = useState(false);
    const [isPomp2Open, setisPomp2Open] = useState(false);
    const [pump1Remaining, setpump1Remaining] = useState(0);
    const [pump2Remaining, setpump2Remaining] = useState(0);
    const [connected, setConnected] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [transferred, setTransferred] = useState(0);
    const defaultDuration = 30;
    const [durationDlg, setDurationDlg] = useState({ open: false, pump: 1, value: String(defaultDuration) });
    const [pump1On, setPump1On] = useState(false);
    const [pump2On, setPump2On] = useState(false);




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
        var topic = deviceid + '/sensorData';
        setErrorMessage(null);
        console.log(Config);
        if (Config.mqttwebsocket === undefined) {
            setErrorMessage("config Cannot read");
            return;
        }
        console.log(Config.mqttwebsocket);
        console.log(Config.mqttWebSocketport);
        clientRef.current = mqttService.connect(userid);

        clientRef.current.on('connect', () => {

            console.log('WSS MQTT bağlandı');
            setMessage(t("Connected"));
            setConnected(true);
            // setClient(client);

            clientRef.current.subscribe(topic);
        });
        /*
         client.on('message', (topic, msg) => {
             setMessage(null);
                if (topic === topic) {
                    var jsonData = JSON.parse(msg.toString());
                    setSoilMoisture(jsonData.soil_moisture);
                    setTemperature(jsonData.temperature);
                    setAirHumidity(jsonData.humidity);
    
                    var icon_ = getMoistureIcon(getSoilMoistureLevel(jsonData.soil_moisture));
                    console.log(icon_);
                    seticon(icon_);
                } 
         });
         */
        clientRef.current.on('error', err => {
            console.log('MQTT WSS HATA:', err);
            setErrorMessage(t("ConnectionError"), err.message);
            setConnected(false);
        });

        return () => {
            clientRef.current.end();
        };

    }

    const StartPomp = async (pompnumber, time) => {
        const mqttClient = mqttService.getClient();
        setErrorMessage(null);

        if (!mqttClient) {
            console.warn('MQTT client henüz bağlanmadı.');
            setErrorMessage("MQTT client henüz bağlanmadı.")
            return;
        }
        var topic = deviceid + '/command';


        const command = {
            command: 'water',
            value: 1,
            time: time,
            pomp: pompnumber
        };
        mqttClient.publish(topic, JSON.stringify(command), { qos: 1 }, (error) => {

            if (error) {
                console.error('Publish Hatası:', error);
                debugger;
                setErrorMessage(`Publish Hatası: ${error.message}`);
            } else {
                setDurationDlg({ open: false, pump: pompnumber, value: String("") });
                if (pompnumber === 1) {
                    setPump1On(true);
                    setpump1Remaining(time);

                } else if (pompnumber === 2) {
                    setPump2On(true);
                    setpump2Remaining(time);
                }


                //setErrorMessage(`Komut gönderildi: ${JSON.stringify(command)}`);
            }
        });
    };


    const uploadImage = async (uri) => {

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

        setImageUri(downloadUrl);


    };

    useEffect(() => {
        connectMqtt();

    }, []);



    const openDurationFor = (pumpNnumber) => {
        setDurationDlg({ open: true, pump: pumpNnumber, value: String("") });

    };

    const handlePump1 = async () => {
        await StartPomp(1, 5);
    };

    const openTaskCreate = (pomp) => {
        setEditorOpen(true);
    };

    const handlePump2 = async () => {
        //if (pump1On) return stopPump(1);

        await StartPomp(2, 5);
    };


    const handlePump = async (pomp, time) => {
        //if (pump1On) return stopPump(1);

        await StartPomp(pomp, time);

        setDurationDlg({ open: false, pump: pomp, value: defaultDuration });

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
        }
    };

    const changePompStatus = async (pumpNumber, status) => {

        if (pumpNumber === 1) {
            setisPomp1Open(status);
            await UpdatePompStatus({ pomp1: status });
        } else if (pumpNumber === 2) {
            setisPomp2Open(status);
            await UpdatePompStatus({ pomp2: status });
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
                        <Text style={styles.name}> {devicename} </Text>
                        <Text style={styles.name}>Aloe Vera</Text>
                        <Text style={styles.description}>Güneşli alanları seven, suyu depolayan bir bitki türüdür.</Text>
                    </View>

                    <ErrorMessage message={errorMessage}></ErrorMessage>

                    <Card>
                        <View style={styles.pompcontainer}>
                            <View style={styles.grid}>
                                <View style={styles.cell}>
                                    <IconButton
                                        icon={pump1On ? "water-pump" : "play-circle-outline"}
                                        size={40}
                                        onPress={() => handlePump1()}
                                        onLongPress={() => openDurationFor(1)}

                                        style={[styles.pumpBtn, { borderColor: "#00BFA5" }, pump1On && { borderWidth: 0 }]}
                                        containerColor={pump1On ? "#00BFA5" : undefined}
                                        iconColor={pump1On ? "white" : "#00BFA5"}
                                        disabled={!isPomp1Open}
                                    />
                                    <Text style={styles.pumpLabel}>{pump1On ? `${pump1Remaining}s` : "Pompa 1"}</Text>

                                    <Switch value={isPomp1Open} onValueChange={(e) => changePompStatus(1, e)} />;
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
                                        icon={pump2On ? "water-pump" : "play-circle-outline"}
                                        size={40}
                                        onPress={() => handlePump2()}
                                        onLongPress={() => openDurationFor(2)}
                                        style={[styles.pumpBtn, { borderColor: "#00BFA5" }, pump2On && { borderWidth: 0 }]}
                                        containerColor={pump2On ? "#00BFA5" : undefined}
                                        iconColor={pump2On ? "white" : "#00BFA5"}
                                        disabled={!isPomp2Open}
                                    />
                                    <Text style={styles.pumpLabel}>{pump2On ? `${pump2Remaining}s` : "Pompa 2"}</Text>
                                    <Switch value={isPomp2Open} onValueChange={(e) => changePompStatus(2, e)} />;
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
                        closeDuration={() => setDurationDlg({ ...duration, open: false, value: defaultDuration })}

                        defaultDuration={defaultDuration}
                        confirmDuration={(e, t) => handlePump(e, t)}
                        errorMessage={errorMessage}
                    ></DurationDlg>

                    <TaskEditor
                        visible={editorOpen}
                        defaultDuration={defaultDuration}
                        onDismiss={() => setEditorOpen(false)}
                        // onSave={upsertTask}
                        initial={editing}
                        t={t}
                    />
                </ScrollView>
            </Card >
        </LinearGradient >
    );
}

export default PlantBigViewPomp;

import React, { useState, useEffect } from 'react';
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
//import storage from '@react-native-firebase/storage';


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
    TextInput,
    useTheme,
} from "react-native-paper";

const screenWidth = Dimensions.get("window").width;


const PlantBigViewPomp = ({ navigation }) => {
    const route = useRoute();
    const [response, setResponse] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);

    const { t, i18n } = useTranslation();
    const { deviceid = '', devicename = '', userid } = route.params || {};
    const [message, setMessage] = useState(t("Connecting"));
    const [errorMessage, setErrorMessage] = useState(null);
    const [editing, setEditing] = useState(undefined);
    const [client, setClient] = useState(null);

    const [isPomp1Open, setisPomp1Open] = useState(false);
    const [isPomp2Open, setisPomp2Open] = useState(false);

    const [connected, setConnected] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [transferred, setTransferred] = useState(0);
    const defaultDuration = 60;
    const [durationDlg, setDurationDlg] = useState({ open: false, pump: 1, value: String(defaultDuration) });
    const [pump1On, setPump1On] = useState(false);
    const [pump2On, setPump2On] = useState(false);
    const [durationvisible, setdurationvisible] = useState(false);



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
        const client = mqtt.connect(Config.mqttwebsocket, {
            port: Config.mqttWebSocketport,
            clientId: userid,
            username: Config.mqtt_username,    // eğer auth varsa
            password: Config.mqtt_password,    // eğer auth varsa
            rejectUnauthorized: false, // self-signed cert için
        });

        client.on('connect', () => {
            console.log('WSS MQTT bağlandı');
            setMessage(t("Connected"));
            setConnected(true);
            setClient(client);
            client.subscribe(topic);
        });

        client.on('message', (topic, msg) => {
            setMessage(null);
            /*   if (topic === topic) {
                   var jsonData = JSON.parse(msg.toString());
                   setSoilMoisture(jsonData.soil_moisture);
                   setTemperature(jsonData.temperature);
                   setAirHumidity(jsonData.humidity);
   
                   var icon_ = getMoistureIcon(getSoilMoistureLevel(jsonData.soil_moisture));
                   console.log(icon_);
                   seticon(icon_);
               }*/
        });

        client.on('error', err => {
            console.log('MQTT WSS HATA:', err);
            setErrorMessage(t("ConnectionError"), err.message);
            setConnected(false);
        });

        return () => {
            client.end();
        };

    }

    const StartPomp = async () => {
        if (!client) {
            console.warn('MQTT client henüz bağlanmadı.');
            return;
        }
        var topic = deviceid + '/command';

        const command = {
            command: 'water',
            value: 1,
        };

        client.publish(topic, JSON.stringify(command), { qos: 1 }, (error) => {
            if (error) {
                console.error('Publish Hatası:', error);
                setErrorMessage('Publish Hatası:', error);
            } else {
                console.log('Komut gönderildi:', command);
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

    useEffect(() => {
        connectMqtt();

    }, []);



    const openDurationFor = (pump) => {
        //const current = pump === 1 ? pump1Duration : pump2Duration;
        setDurationDlg({ open: true, pump, value: String("") });
        console.log(durationDlg);
        setdurationvisible(true);
        debugger;
        // setCustomSeconds(String(current));

    };

    const handlePump1 = () => {
        //if (pump1On) return stopPump(1);
        //startPump(1, pump1Duration);
    };

    const openTaskCreate = (pomp) => {
        //setEditing(undefined);
        setEditorOpen(true);
    };

    const handlePump2 = () => {
        //if (pump1On) return stopPump(1);
        //startPump(1, pump1Duration);
    };
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


                    <Card>
                        <View style={styles.pompcontainer}>
                            <View style={styles.grid}>
                                <View style={styles.cell}>
                                    <IconButton
                                        icon={pump1On ? "water-pump" : "play-circle-outline"}
                                        size={34}
                                        onPress={handlePump1}
                                        onLongPress={() => openDurationFor(1)}

                                        style={[styles.pumpBtn, { borderColor: "#00BFA5" }, pump1On && { borderWidth: 0 }]}
                                        containerColor={pump1On ? "#00BFA5" : undefined}
                                        iconColor={pump1On ? "white" : "#00BFA5"}
                                        disabled={!isPomp1Open}
                                    />
                                    <Text style={styles.pumpLabel}>{pump1On ? `${pump1Remaining}s` : "Pompa 1"}</Text>

                                    <Switch value={isPomp1Open} onValueChange={() => setisPomp1Open(!isPomp1Open)} />;
                                </View>

                                <View style={styles.cell}>
                                    <IconButton icon="calendar-clock"
                                        size={34}
                                        disabled={!isPomp1Open}
                                        onPress={() => openTaskCreate(1)}
                                    />
                                    <Text style={styles.pumpLabel}></Text>
                                </View>

                                <View style={styles.cell}>
                                    <IconButton
                                        icon={pump1On ? "water-pump" : "play-circle-outline"}
                                        size={34}
                                        onPress={handlePump2}
                                        onLongPress={() => openDurationFor(2)}
                                        style={[styles.pumpBtn, { borderColor: "#00BFA5" }, pump1On && { borderWidth: 0 }]}
                                        containerColor={pump1On ? "#00BFA5" : undefined}
                                        iconColor={pump1On ? "white" : "#00BFA5"}
                                        disabled={!isPomp2Open}
                                    />
                                    <Text style={styles.pumpLabel}>{pump2On ? `${pump2Remaining}s` : "Pompa 2"}</Text>
                                    <Switch value={isPomp2Open} onValueChange={() => setisPomp2Open(!isPomp2Open)} />;
                                </View>

                                <View style={styles.cell}>
                                    <IconButton
                                        icon="calendar-clock"
                                        size={34}
                                        disabled={!isPomp2Open}
                                        onPress={() => openTaskCreate(2)}
                                    />
                                    <Text style={styles.pumpLabel}></Text>
                                </View>
                            </View>
                        </View>
                    </Card>

                    {
                        /*<TouchableOpacity style={styles.button} onPress={() => setEditorOpen(true)}>
                            <Text style={styles.waterButton}>   {t("StartWaterPomp")}</Text>
                        </TouchableOpacity>*/
                    }

                    <ErrorMessage message={errorMessage}></ErrorMessage>

                    <DurationDlg

                        duration={durationDlg}
                        closeDuration={() => setdurationvisible(false)}
                        durationvisible={durationvisible}
                        defaultDuration={defaultDuration}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4fdfd",
        padding: 20
    },
    pompcontainer: {
        padding: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cell: {
        width: '45%',
        height: 120,
        backgroundColor: '#e0f2f1',
        marginBottom: 12,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    pumpLabel: {
        marginTop: 8,
        fontSize: 14,
        color: '#00796b',
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        marginVertical: 10,
        justifyContent: 'space-between',
    },
    imageContainer: {
        position: "relative",
        alignItems: "center",
        marginBottom: 20
    },
    image: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 2,
        borderColor: "#009688"
    },
    editIcon: {
        position: "absolute",
        bottom: 10,
        right: screenWidth / 2 - 90,
        backgroundColor: "#009688",
        borderRadius: 20,
        padding: 6
    },
    infoSection: {
        alignItems: "center",
        marginBottom: 20
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#00796b"
    },
    description: {
        fontSize: 14,
        color: "#555",
        textAlign: "center",
        marginTop: 5
    },
    chartSection: {
        marginBottom: 30
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#00796b"
    },
    chart: {
        borderRadius: 12
    },
    waterButton: {
        backgroundColor: "#00796b",
        marginHorizontal: 40,
        borderRadius: 10,
        marginBottom: 30
    },
    leftColumn: {
        flex: 1,
        alignItems: 'flex-start',
        gap: 2,
    },

    middleColumn: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    rightColumn: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});


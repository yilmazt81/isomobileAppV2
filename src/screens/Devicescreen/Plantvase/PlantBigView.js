import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';

import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Switch, Button, Card } from 'react-native-paper';
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

import styles from './PlantBigViewStyle';
import ErrorMessage from '../../../companent/ErrorMessage';




const PlantBigView = () => {
    const route = useRoute();
    const [response, setResponse] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { t, i18n } = useTranslation();
    const { deviceid = '', devicename = '', userid = "" } = route.params || {};
    const [message, setMessage] = useState(t("Connecting"));
    const [errorMessage, setErrorMessage] = useState(null);

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
    const [pompuRunning, setpompuRunning] = useState(false);
    const [pompRunTime, setpompRunTime] = useState(0);



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
            client.subscribe(topicsensor);
            client.subscribe(statusTopic);
        });

        client.on('message', (topic, msg) => {
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

                        pompuRunning(arr[2] === "1"); 

                    }
                }

            }
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


        setpompuRunning(false);
        if (!client) {
            console.warn('MQTT client henüz bağlanmadı.');
            return;
        }
        var topiccommand = deviceid + '/command';

        const command = {
            command: 'water',
            value: 1,
            time: pompRunTime
        };

        client.publish(topiccommand, JSON.stringify(command), { qos: 1, retain: false }, (error) => {
            if (error) {
                console.error('Publish Hatası:', error);
                setErrorMessage('Publish Hatası:', error);

            } else {
                console.log('Komut gönderildi:', command);
                setpompuRunning(true);
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

    // Örnek veri (gerçek sensör verisiyle değiştirilebilir)
    /*const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cumrt", "Paz"];
    const humidityData = [60, 65, 70, 75, 72, 70, 60];
    const temperatureData = [22, 24, 26, 25, 23, 25, 26];
    const soilMoistureData = [40, 45, 38, 50, 42, 34, 50];
    const chartConfig = {
        backgroundColor: "#e0f7fa",
        backgroundGradientFrom: "#e0f7fa",
        backgroundGradientTo: "#b2ebf2",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
        labelColor: () => '#00796b',
    };*/



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
                        <Text style={styles.name}>Aloe Vera</Text>
                        <Text style={styles.description}>Güneşli alanları seven, suyu depolayan bir bitki türüdür.</Text>
                    </View>
                    <StatusCard icon={icon}
                        // temperature={temperature}
                        //airHumidity={airHumidity}
                        soil_moisture={soil_moisture}
                        t={t}
                    ></StatusCard>

                    {!pompuRunning ? <Card>
                        <Text style={styles.PompTitle}>{t("WaterPompTimeSecond")} {pompRunTime}</Text>
                        <Slider
                            step={1}
                            style={styles.slider}
                            minimumValue={10}
                            maximumValue={160}

                            value={pompRunTime}
                            onValueChange={setpompRunTime}
                        />
                    </Card> : ""
                    }
                    {/* Nem 
            <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>Sıcaklık (°C)</Text>
                <LineChart
                    data={{ labels: days, datasets: [{ data: temperatureData }] }}
                    width={screenWidth - 40}
                    height={180}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
            </View>
 
            <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>Toprak Nem Oranı (%)</Text>
                <LineChart
                    data={{ labels: days, datasets: [{ data: soilMoistureData }] }}
                    width={screenWidth - 40}
                    height={180}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
            </View>
*/}





                    <Button disabled={pompuRunning} icon={({ size, color }) => (
                        <MaterialDesignIcons name="engine"
                            size={size}
                            color={color} />
                    )}
                        mode="contained" onPress={StartPomp}>
                        {t("StartWaterPomp")}
                    </Button>

                    {pompuRunning ?
                        <LottieView
                            source={require('../../assets/water.json')}
                            autoPlay
                            loop
                            style={styles.lottie}
                        /> : ""}
                    <ErrorMessage message={errorMessage}></ErrorMessage>
                </ScrollView>
            </Card>
        </LinearGradient>
    );
}

export default PlantBigView;


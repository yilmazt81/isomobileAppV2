import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, PermissionsAndroid, Platform, StyleSheet, Alert } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import WifiManager from "react-native-wifi-reborn";
import { useRoute } from '@react-navigation/native';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../../companent/ErrorMessage';
import LottieView from 'lottie-react-native';
import Config from 'react-native-config';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { SendParams } from '../../lib/SendConfigToDevice';

import LinearGradient from 'react-native-linear-gradient';
import Database from '../../lib/Database';

const WifiSettingsScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const route = useRoute();
    const deviceType = route.params?.deviceType || 'V1'; // Varsayılan değer olarak 'V1' kullanılıyor
    const { devicessid = '', devicepassword = '' } = route.params || {};
    const { defaultSsid = '' } = route.params || {};


    const [ssidDevice] = useState(devicessid);
    const [passwordDevice] = useState(devicepassword);
    const [deviceName, setDeviceName] = useState(deviceType); // Yeni state değişkeni

    const [smartdeviceId, setsmartdeviceId] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const [ssid, setSsid] = useState(defaultSsid);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [deviceWifiConnected, setDeviceWifiConnected] = useState(false);

    useEffect(() => {

        requestPermissions();

    }, []);

    const handleConnect = () => {
        // Burada WiFi bilgilerini kaydetme ya da gönderme işlemleri yapılabilir
        // Alert.alert('Bağlantı', `SSID: ${ssid}\nŞifre: ${password}`);
    };
    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_WIFI_STATE,
                    PermissionsAndroid.PERMISSIONS.CHANGE_WIFI_STATE
                ]);
                console.log('Permissions:', granted);
            } catch (err) {
                console.warn(err);
            }
        }
    };

    function generateUUID(digits) {
        let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
        let uuid = [];
        for (let i = 0; i < digits; i++) {
            uuid.push(str[Math.floor(Math.random() * str.length)]);
        }
        return uuid.join('');
    }

    const connectToWifi = async () => {
        var tmpdeviceId = generateUUID(10);


        //setDeviceWifiConnected(true);
        //
        
        RegisterDevice(tmpdeviceId);
        /*
        WifiManager.connectToProtectedSSID(ssidDevice, passwordDevice, false)
            .then(() => {
                //Alert.alert('Bağlantı Başarılı', `WiFi ağına bağlanıldı: ${ssidDevice}`);   

                setDeviceWifiConnected(true);
                RegisterDevice(tmpdeviceId);
                SendParams(ssid, password, tmpdeviceId)
                //Config.mqtt_server = 'mqtts://m6e105d6.ala.eu-central-1.emqxsl.com';
            })
            .catch((error) => {
                console.log(error);
                setErrorMessage(error.message);
                setDeviceWifiConnected(false);
                //  Alert.alert('Bağlantı Hatası', 'WiFi ağına bağlanılamadı.');
            });
            */
    };



    const RegisterDevice = async (newdeviceid) => {
        try {
            // Firebase Auth ile kullanıcı oluştur

            const user = auth().currentUser;
            console.log('Current User:', user);
            var newId = generateUUID(20);

            if (user) {
                // Yeni cihazı veritabanına kaydet
                /*
                // Firestore'a kullanıcı bilgilerini kaydet
                await firestore()
                  .settings({
                    persistence: true // <-- Bu satır kalıcılığı etkinleştirir
                  }).collection('Device').doc(newId).set({
                    devicename: deviceName,
                    devicetype: deviceType,
                    userid: user.uid,
                    deviceid: newdeviceid,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    soilMoistureLevel: "",
                    airHumidity: 90,
                    temperature: 0,
                    wifiName: ssid,
        
                  });
                  */
                 debugger;
                //deviceid, devicename, devicetype, wifiName
                Database.AddDevice(newdeviceid, deviceName, deviceType, ssid);
                navigation.navigate("Home");

                //alert('Kayıt başarılı!');
                // Kayıt başarılı olduktan sonra NEXT ekranına yönlendir

            } else {
                setErrorMessage(t("UserNotLoggedIn"));
            }

        } catch (error) {
            //alert(error.message);
            setErrorMessage(error.message);
            console.log('Registration error:', error);
        }
    };


    return (
        <LinearGradient colors={['#090979', '#00D4FF', '#020024']} style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{t("WifiSettings")}</Text>
                <Text style={styles.label}>{t("WFSettingsSSID")}</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder={t("WFSettingsSSID")}
                        value={ssid}
                        onChangeText={setSsid}
                    />
                    <TouchableOpacity onPress={() => navigation.navigate("WifiScanner")}>
                        <MaterialDesignIcons
                            name='wifi'
                            size={24}
                            color="gray"
                            style={{ marginLeft: 8 }}
                        />
                    </TouchableOpacity>

                </View>
                <Text style={styles.label}>{t("password")}</Text>

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder={t("password")}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />



                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <MaterialDesignIcons
                            name={showPassword ? 'eye' : 'eye-off'}
                            size={24}
                            color="gray"
                            style={{ marginLeft: 8 }}
                        />
                    </TouchableOpacity>
                </View>
                <View>

                    <TextInput value={smartdeviceId}></TextInput>
                </View>

                <View>
                    <Text style={styles.label}>{t("DeviceName")}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t("DeviceName")}
                        value={deviceName}
                        onChangeText={setDeviceName}
                    />
                </View>
                <ErrorMessage message={errorMessage}></ErrorMessage>
                {deviceWifiConnected &&
                    (
                        <LottieView source={require('../assets/Animation_Connection.json')}
                            autoPlay loop style={{ width: 150, height: 150, alignSelf: 'center' }} />

                    )}


                <TouchableOpacity style={styles.button} onPress={connectToWifi}>
                    <Text style={styles.buttonText}>{t("SetSettings")}</Text>
                </TouchableOpacity>

            </View>
        </LinearGradient>
    );
};

export default WifiSettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 14,
        borderRadius: 10,
        marginTop: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
});

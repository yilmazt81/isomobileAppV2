import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ErrorMessage from '../../companent/ErrorMessage';
import { useTranslation } from 'react-i18next';
import { AuthContext } from "../../navigation/AppNavigator";
import i18n from '../../i18n';
import PlantSmallView from '../Devicescreen/Plantvase/PlantSmallView';
import LinearGradient from 'react-native-linear-gradient';
import Database from '../../lib/Database';
import { useWifiInternetStatus } from '../../lib/useWifiInternetStatus';
import LottieView from 'lottie-react-native';
import PlantSmallViewPomp from '../Devicescreen/PlantWater2Pomp/SwipeablePlantPomp';
import SwipeablePlantV1 from '../Devicescreen/Plantvase/SwipeablePlantV1';
import SwipeableItem from '../../companent/SwipeableItem';
import { Button } from 'react-native-paper';
import WifiManager from "react-native-wifi-reborn";



const HomeScreen = ({ navigation }) => {

    const [deviceList, setDeviceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();
    const [userid, setUserid] = useState(null);

    // const { isWifi, isConnected, hasInternet } = useWifiInternetStatus();

    const { isWifi } = useState(true);
    const { isConnected } = useState(true);
    const { hasInternet } = useState(true);

    const addDeviceToCloud = async () => {
        var dbdeviceList = await Database.getDeviceList();

        try {

            firestore().settings({ persistence: true });

            const user = auth().currentUser;

            for (let element of dbdeviceList) {
                const newId = firestore().collection('Device').doc().id;
                const ssid = "UNKNOWN"; // veya WifiManager'dan al

                await firestore().collection('Device').doc(newId).set({
                    devicename: element.devicename,
                    devicetype: element.devicetype,
                    userid: user.uid,
                    deviceid: element.deviceid,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    soilMoistureLevel: "",
                    airHumidity: 90,
                    temperature: 0,
                    wifiName: element.wifiName,
                });

                await Database.DeleteDevice(element.id);
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }
    const getDeviceList = async () => {
        try {
            setError(null);
            setRefreshing(true);
            var user = auth().currentUser;
            if (!user) {
                console.log('Henüz giriş yapılmamış');
                return;
            }
            await Database.init();

            await addDeviceToCloud();

            const usersCollection = await firestore().collection('Device').where('userid', 'in', [user.uid]).get()
                .then((querySnapshot) => {

                    setDeviceList(documents => querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                });


        } catch (error) {
            setError(error.message);
            console.error('Firestore veri çekme hatası:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        // synchronizeData();
        const user = auth().currentUser;
        setUserid(user.uid);

        addDeviceToCloud();
        getDeviceList();
    }, []);
    const CreateViewVaseV1 = (device) => {

        return (
            <TouchableOpacity
                key={device.id}
                style={{ width: '100%', marginBottom: 10 }} // tam genişlik, alt boşluk
                activeOpacity={0.8}
            >    <View style={{ width: '100%' }}>

                    <SwipeablePlantV1
                        device={device}
                        t={t}
                        userid={userid}
                        onDelete={handleDelete}
                        onPress={() =>
                            navigation.navigate('PlantBigView', {
                                deviceid: device.deviceid,
                                deviceType: device.devicetype,
                                devicename: device.devicename,
                                userid: userid,
                                firebasedocumentid: device.id
                            })
                        }
                    />
                </View>
            </TouchableOpacity >
        )
    }

    const handleDelete = async (device) => {
        debugger;


        await firestore()
            .collection('Device')
            .doc(device.id)
            .delete();
        getDeviceList();
        //Alert.alert('Test', 'Bu ekran yüklendi, alert çalışıyor mu?', device.id);
        /*   await Database.DeleteDevice(device.id);
           setDeviceList((prev) => prev.filter((d) => d.id !== device.id));
           */
    };

    const ConnectWifiTest = async () => {
        try {
            await WifiManager.connectToProtectedSSID("smartVase2", "78945621", false, false);
            setTimeout(async () => {
                try {
                    const connectedSSID = await WifiManager.getCurrentWifiSSID();
                    console.log('Bağlı SSID:', connectedSSID);
                    if (connectedSSID === ssidDevice) {
                        // setDeviceWifiConnected(true);
                        //Alert.alert('Bağlantı Başarılı', `WiFi ağına bağlanıldı: ${ssidDevice}`);



                        Alert.alert('Bağlantı Başarılı send Param Yaptı');
                        //swich device to standar wifi or 3G

                    } else {
                        console.log('Bağlantı başarısız ya da farklı ağa bağlı');
                        setError('Bağlantı başarısız ya da farklı ağa bağlı');

                    }
                } catch (e) {
                    console.log(error);
                    setError(error.message);
                    Alert.alert('Bağlantı Hatası', 'WiFi ağına bağlanılamadı.');
                }
            }, 5000);

        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }
    const CreateViewPlantWater2Pomp = (device) => {

        return (
            <TouchableOpacity
                key={device.id}
                style={{ width: '100%', marginBottom: 10 }} // tam genişlik, alt boşluk
                activeOpacity={0.8}

            >    <View style={{ width: '100%' }}>

                    <PlantSmallViewPomp
                        device={device}
                        t={t}
                        onDelete={handleDelete}
                        userid={userid}
                        onPress={() =>
                            navigation.navigate('PlantBigViewPomp', {
                                deviceid: device.deviceid,
                                deviceType: device.devicetype,
                                devicename: device.devicename,
                                userid: userid,
                                firebasedocumentid: device.id
                            })
                        }
                    />
                    {/*<PlantSmallViewPomp
                        style={{ width: '100%' }}
                        key={device.id}
                        plantName={device.devicename}
                        // soilMoistureLevel={device.soilMoistureLevel}
                        // airHumidity={device.airHumidity}
                        //  temperature={device.temperature}
                        deviceid={device.deviceid}
                        deviceType={device.devicetype}


                    />*/}
                </View>
            </TouchableOpacity >
        )
    }



    return (

        <LinearGradient colors={['#090979', '#00D4FF', '#020024']} style={styles.container}>

            <ScrollView
                contentContainerStyle={{ padding: 10 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getDeviceList} />
                }
            >
                <Button onPress={ConnectWifiTest}>Test Wifi Connect</Button>
                <ErrorMessage message={error} />

                {
                    deviceList.map((device, index) => {
                        if (device.devicetype === 'SmartVaseV1') {
                            return CreateViewVaseV1(device)
                        } else if (device.devicetype === 'SmartVase2Multi') {
                            return CreateViewPlantWater2Pomp(device);
                        } else {
                            return null;
                        }
                    })
                }

                {isWifi && hasInternet ? <LottieView source={require('../assets/Online_Offline.json')}
                    autoPlay loop style={{ width: 150, height: 150, alignSelf: 'center' }}></LottieView> : ""}

            </ScrollView>
        </LinearGradient >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
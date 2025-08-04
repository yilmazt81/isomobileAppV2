import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
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


const HomeScreen = ({ navigation }) => {

    const [deviceList, setDeviceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();

    const { isWifi, isConnected, hasInternet } = useWifiInternetStatus();

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


            if (isWifi && hasInternet)//add to firebase 
            {
                var dbdeviceList = await Database.getDeviceList();

                for (let index = 0; index < dbdeviceList.length; index++) {
                    const element = dbdeviceList[index];
                    debugger;
                    await firestore()
                        .settings({
                            persistence: true // <-- Bu satır kalıcılığı etkinleştirir
                        }).collection('Device').doc(newId).set({
                            devicename: element.devicename,
                            devicetype: element.devicetype,
                            userid: user.uid,
                            deviceid: element.deviceid,
                            createdAt: firestore.FieldValue.serverTimestamp(),
                            soilMoistureLevel: "",
                            airHumidity: 90,
                            temperature: 0,
                            wifiName: ssid,
                        });

                    await Database.DeleteDevice(element.id);
                }

                const usersCollection = await firestore().collection('Device').where('userid', 'in', [user.uid]).get()
                    .then((querySnapshot) => {

                        setDeviceList(documents => querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                    });
            } else {
                console.log("yok offline");

                var dbdeviceList = await Database.getDeviceList();
                setDeviceList(dbdeviceList);
            }


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
        getDeviceList();
    }, []);
    const CreateViewVaseV1 = (device) => {

        return (
            <TouchableOpacity
                key={device.id}
                style={{ width: '100%', marginBottom: 10 }} // tam genişlik, alt boşluk
                activeOpacity={0.8}
                onPress={() => navigation.navigate('PlantBigView',
                    { deviceid: device.deviceid, deviceType: device.devicetype, devicename: device.devicename })}
            >    <View style={{ width: '100%' }}>
               
                    <SwipeablePlantV1
                        device={device}
                        t={t}
                        onDelete={handleDelete}
                        onPress={() =>
                            navigation.navigate('PlantBigView', {
                                deviceid: device.deviceid,
                                deviceType: device.devicetype,
                                devicename: device.devicename,
                            })
                        }
                    />
                </View>
            </TouchableOpacity >
        )
    }

    const handleDelete = async (device) => {
        await Database.DeleteDevice(device.id);
        setDeviceList((prev) => prev.filter((d) => d.id !== device.id));
    };
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
                        onPress={() =>
                            navigation.navigate('PlantBigViewPomp', {
                                deviceid: device.deviceid,
                                deviceType: device.devicetype,
                                devicename: device.devicename,
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
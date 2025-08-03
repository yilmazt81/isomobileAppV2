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
const HomeScreen = ({ navigation }) => {

    const [deviceList, setDeviceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();
    const [isConnected, setisConnected] = useState(false);

    const getDeviceList = async () => {
        try {
            setError(null);
            setRefreshing(true);
            var user = auth().currentUser;
            if (!user) {
                console.log('Henüz giriş yapılmamış');
                return;
            }

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
                    <PlantSmallView
                        style={{ width: '100%' }}
                        key={device.id}
                        plantName={device.devicename}
                        // soilMoistureLevel={device.soilMoistureLevel}
                        // airHumidity={device.airHumidity}
                        //  temperature={device.temperature}
                        deviceid={device.deviceid}
                        deviceType={device.devicetype}


                    />
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
                        } else {
                            return null; // Gösterme
                        }
                    })
                }


            </ScrollView>
        </LinearGradient>
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
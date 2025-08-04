import React, { useEffect, useState } from 'react';

import { Dialog, Portal, Button, PaperProvider } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import WifiManager from 'react-native-wifi-reborn';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {
    View,
    Text,
    FlatList,
    PermissionsAndroid,
    Platform,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
const WifiScannerModal = ({ showmodal, onSubmit, onClose }) => {
    const [visible, setVisible] = useState(showmodal);
    const [wifiList, setWifiList] = useState([]);
    const hideDialog = () => { setVisible(false); onClose() };
    const [error, setError] = useState(null); 
    const { t, i18n } = useTranslation();

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Konum İzni Gerekli',
                    message: 'WiFi taraması için konum izni gerekiyor.',
                    buttonNeutral: t("AskMeLater"),
                    buttonNegative: t("Cancel"),
                    buttonPositive: t("OK"),
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const loadWifiList = async () => {
        debugger;
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            console.warn('Konum izni verilmedi.');
            return;
        }

        WifiManager.loadWifiList()
            .then((networks) => {
                console.log('WiFi listesi:', networks);
                const sortedList = networks.sort((a, b) => b.level - a.level);

                setWifiList(sortedList);
            })
            .catch((error) => {
                console.error('WiFi listesi alınamadı:', error);
            });
    };

    useEffect(() => {
        loadWifiList();
    }, []);

    const getSignalIcon = (level) => {
        // Android'de sinyal seviyesi genellikle -30 (çok iyi) ile -90 (çok kötü) arası olur
        if (level >= -50) return 'wifi-strength-4';
        if (level >= -60) return 'wifi-strength-3';
        if (level >= -70) return 'wifi-strength-2';
        if (level >= -80) return 'wifi-strength-1';
        return 'wifi-strength-outline';
    };

    const handleSelect = (ssid) => {

    };


    return (

        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.ScrollArea>

                    <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                        <Text>This is a scrollable area</Text>
                    </ScrollView>

                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>{t("Cancel")}</Button>
                   
                </Dialog.Actions>
            </Dialog>
        </Portal>

    );
};

export default WifiScannerModal;
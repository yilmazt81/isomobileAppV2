import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WifiManager from 'react-native-wifi-reborn';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useRoute } from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
const WifiScannerScreen = () => {
  const [wifiList, setWifiList] = useState([]);
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const route = useRoute();
  const { onReturn } = route.params || {};
  // Gerekli izinleri kullanıcıdan iste
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Konum İzni Gerekli',
          message: 'WiFi taraması için konum izni gerekiyor.',
          buttonNeutral: 'Daha sonra sor',
          buttonNegative: 'İptal',
          buttonPositive: 'İzin Ver',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const loadWifiList = async () => {
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

  // Bir SSID seçildiğinde ayar ekranına yönlendir
  const handleSelect = (ssid) => {
    if (onReturn) {
      onReturn({ ssid }); // veri gönder
    }
    navigation.goBack();
  };

  return (

    <LinearGradient colors={['#090979', '#00D4FF', '#020024']} style={styles.container}>

      <View style={styles.card}>
        <Button title="Yeniden Tara" onPress={loadWifiList} />

        {error && <Text style={styles.error}>{error}</Text>}
        <FlatList
          data={wifiList}
          keyExtractor={(item, index) => item.BSSID || index.toString()}
          renderItem={({ item }) => (

            <View style={styles.row}>
              <TouchableOpacity style={styles.item} onPress={() => handleSelect(item.SSID)}>
                <View>
                  <MaterialDesignIcons
                    name={getSignalIcon(item.level)}
                    size={24}
                    color="#333"
                    style={styles.icon}
                  />
                  <Text style={styles.ssid}>{item.SSID}</Text>

                </View>

              </TouchableOpacity>
            </View>
          )}
        /></View>
    </LinearGradient >
  );
};

export default WifiScannerScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
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
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  ssid: { fontSize: 18, fontWeight: 'bold' },
  signal: { color: 'gray' },
  error: { color: 'red', marginVertical: 30 },
});

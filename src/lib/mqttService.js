// mqttService.js - GELİŞMİŞ VERSİYON

import mqtt from 'mqtt';
import Config from 'react-native-config';

let client = null;

const connect = (clientId) => {
    if (client && client.connected) return client;

    if (client) {
        client.end(true);
        client = null;
    }

    const url = Config.mqttwebsocket;

    client = mqtt.connect(url, {
        clientId,
        username: Config.mqtt_username,
        password: Config.mqtt_password,
        keepalive: 15,
        reconnectPeriod: 3000,
        clean: false,
        rejectUnauthorized: false,
    });

    client.on('connect', () => {
        console.log('[MQTT] Bağlandı');
    });

    client.on('error', (err) => {
        console.error('[MQTT] Hata:', err.message);
    });

    client.on('reconnect', () => {
        console.warn('[MQTT] Yeniden bağlanıyor...');
    });

    client.on('offline', () => {
        console.warn('[MQTT] Offline oldu.');
    });

    client.on('close', () => {
        console.warn('[MQTT] Bağlantı kapandı.');
    });

    return client;
};

const getClient = () => {
    return client;
};

const disconnect = () => {
    if (client) {
        client.end();
        client = null;
        console.log('[MQTT] Bağlantı sonlandırıldı.');
    }
};

export default {
    connect,
    getClient,
    disconnect,
};
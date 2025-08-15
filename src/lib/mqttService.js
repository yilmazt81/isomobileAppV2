// mqttService.js
import mqtt from 'mqtt';
import Config from 'react-native-config';

let client = null;

const connect = (clientId) => {
    if (client) return client; // daha önce bağlandıysa tekrar bağlanma

    const url = Config.mqttwebsocket;
    const port = Config.mqttWebSocketport;

    client = mqtt.connect(url, {
        port,
        clientId,
        username: Config.mqtt_username,
        password: Config.mqtt_password,
        keepalive: 60,
        reconnectPeriod: 3000,
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

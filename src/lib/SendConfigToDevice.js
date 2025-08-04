import axios from "axios";
import Config from 'react-native-config';

export async function SendParams(wifiName, wifiPassword, device_id) {
  var sendData = {
    wifi_ssid: wifiName,
    wifi_password: wifiPassword,
    mqtt_server: Config.mqttadressfordevice,
    mqtt_port: Config.mqttportfordevice,
    mqtt_username: Config.mqtt_username,
    mqtt_password: Config.mqtt_password,
    deviceid: device_id,
  };

  const { data } = await axios.post(Config.deviceSaveParameterUrl, sendData);
  return data;
}

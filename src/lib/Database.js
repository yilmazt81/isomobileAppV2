import SQLite from 'react-native-sqlite-storage';
import { string } from 'yup';


SQLite.enablePromise(true);

class Database {
    constructor() {
        this.db = null;
    }

    async init() {

        if (this.db == null) {
            this.db = await SQLite.openDatabase({ name: 'device.db', location: 'default' });

        }

        const sql = `CREATE TABLE IF NOT EXISTS Device (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    deviceid TEXT,
                    devicename TEXT,
                    devicetype TEXT,
                    wifiName TEXT
                    );`;
        console.log(sql);

        await this.db.executeSql(sql);
    }

    async getDeviceList() {
        const [results] = await this.db.executeSql('SELECT * FROM Device ORDER BY id DESC');
        const rows = results.rows;
        const items = [];
        for (let i = 0; i < rows.length; i++) {
            items.push(rows.item(i));
        }
        return items;
    }

    async AddDevice(deviceid, devicename, devicetype, wifiName) {
        const sql = `INSERT INTO Device (deviceid, devicename, devicetype, wifiName) VALUES ('${deviceid}', '${devicename}','${devicetype}','${wifiName}')`;
        
        await this.db.executeSql(sql);
    }

    async DeleteDevice(id) {
        await this.db.executeSql('DELETE FROM Device WHERE id = ?', [id]);
    }
}

// Singleton olarak dışa aktar
export default new Database();

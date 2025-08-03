import SQLite from 'react-native-sqlite-storage';


SQLite.enablePromise(true);

class Database {
    constructor() {
        this.db = null;
    }

    async init() {
        if (this.db) return;
        this.db = await SQLite.openDatabase({ name: 'device.db', location: 'default' });

        await this.db.executeSql(`
      'CREATE TABLE IF NOT EXISTS 
        Device (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            deviceid TEXT, 
            devicename TEXT,
            devicetype TEXT, 
            wifiName TEXT
        );
    `);
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
        await this.db.executeSql('INSERT INTO Device (deviceid, devicename, devicetype, wifiName) VALUES (?, ?,?,?)', [deviceid, 0], [devicename, 1], [devicetype, 2], [wifiName, 3]);
    }

    async DeleteDevice(id) {
        await this.db.executeSql('DELETE FROM Device WHERE id = ?', [id]);
    }
}

// Singleton olarak dışa aktar
export default new Database();

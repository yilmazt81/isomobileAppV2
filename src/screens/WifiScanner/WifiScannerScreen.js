import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WifiScannerScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>WiFi Scanner</Text>
            {/* Add your WiFi scanning logic here */}
        </View>
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

export default WifiScannerScreen;
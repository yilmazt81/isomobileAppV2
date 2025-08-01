import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WifiSettingsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>WiFi Settings</Text>
            {/* Add your WiFi settings UI here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
});

export default WifiSettingsScreen;
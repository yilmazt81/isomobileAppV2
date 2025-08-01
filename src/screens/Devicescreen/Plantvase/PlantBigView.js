import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlantBigView = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Plant Big View</Text>
            {/* Add your plant details and UI here */}
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

export default PlantBigView;
import React from 'react';
import {
    View, Text, StyleSheet,
    
    Image,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProfileEditScreen from './ProfileEditScreen';
const ProfileScreen = () => {
    return (
        <LinearGradient colors={['#090979', '#00D4FF', '#020024']}
            style={styles.container}>            
            <ProfileEditScreen></ProfileEditScreen>
        </LinearGradient>
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

export default ProfileScreen;
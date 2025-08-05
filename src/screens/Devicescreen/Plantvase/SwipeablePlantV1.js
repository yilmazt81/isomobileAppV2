// ExampleSwipeablePlant.js
import React from 'react';
import {
    Animated,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert,
    View,
} from 'react-native';
import SwipeableItem from '../../../companent/SwipeableItem';
import PlantSmallViewPomp from './PlantSmallView';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
const renderDeleteAction = (onDelete, t) => {
    return (progress, dragX) => {
        const scale = dragX.interpolate
            ? dragX.interpolate({
                inputRange: [-100, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp',
            })
            : 1;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    Alert.alert(
                        t ? t('Sil') : 'Sil',
                        t ? t('DeleteDeviceMessage') : 'Bu cihazı silmek istediğine emin misin?',
                        [
                            { text: t ? t('Cancel') : 'İptal', style: 'cancel' },
                            {
                                text: t ? t('Delete') : 'Sil',
                                style: 'destructive',
                                onPress: onDelete,
                            },
                        ]
                    );
                }}
                style={deleteStyles.button}
            >
                <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
                    <MaterialDesignIcons name="trash-can" size={40} color="white" />
                    <Text style={deleteStyles.text}>{t ? t('Delete') : 'Delete'}</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };
};

const deleteStyles = StyleSheet.create({
    button: {
        backgroundColor: '#ff3b30',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginVertical: 5,
        borderRadius: 8,
        padding: 10,
    },
    text: {
        color: 'white',
        fontSize: 12,
        marginTop: 4,
    },
});

const SwipeablePlantV1 = ({ device, onDelete, onPress, t }) => {
    return (
        <SwipeableItem
            renderRightActions={renderDeleteAction(() => onDelete(device), t)}
            onPress={onPress}
        >
            <PlantSmallViewPomp
                key={device.id}
                plantName={device.devicename}
                deviceid={device.deviceid}
                deviceType={device.devicetype}
            />
        </SwipeableItem>
    );
};

export default SwipeablePlantV1;

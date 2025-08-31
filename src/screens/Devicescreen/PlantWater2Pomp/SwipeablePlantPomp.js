// ExampleSwipeablePlant.js
import React, { useEffect } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  View,
  InteractionManager,
  ToastAndroid
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import SwipeableItem from '../../../companent/SwipeableItem';
import PlantSmallViewPomp from './PlantSmallViewPomp';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

const renderDeleteAction = (onDelete, t) => {
  return (progress, dragX) => {
    const scale = dragX?.interpolate
      ? dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      })
      : 1;

    return (
      <RectButton
        style={deleteStyles.button}
        onPress={() => {
          console.log('silme butonuna basıldı');
          setTimeout(() => {
            Alert.alert(
              t ? t('Sil') : 'Sil',
              t
                ? t('DeleteDeviceMessage')
                : 'Bu cihazı silmek istediğine emin misin?',
              [
                { text: t ? t('Cancel') : 'İptal', style: 'cancel' },
                {
                  text: t ? t('Delete') : 'Sil',
                  style: 'destructive',
                  onPress: onDelete,
                },
              ],
              { cancelable: true }
            );
          }, 100);
        }}
      >
        <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
          <MaterialDesignIcons name="trash-can" size={32} color="white" />
          <Text style={deleteStyles.text}>{t ? t('Delete') : 'Delete'}</Text>
        </Animated.View>
      </RectButton>
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

const SwipeablePlantPomp = ({ device, onDelete, onPress, t, userid,firebasedocumentid }) => {


  return (
    <SwipeableItem
      renderRightActions={renderDeleteAction(() => onDelete(device), t)}
      onPress={onPress}
    >
      <PlantSmallViewPomp
        key={device.id}
         pomp1status={device.pomp1}
         pomp2status={device.pomp2}
        plantName={device.devicename}
        deviceid={device.deviceid}
        deviceType={device.devicetype}
        userid={userid}
        firebasedocumentid={firebasedocumentid}
      />
    </SwipeableItem>
  );
};

export default SwipeablePlantPomp;

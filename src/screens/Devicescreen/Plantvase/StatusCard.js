// StatusCard.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getTemperatureColor } from './iconfunctions';

export default function StatusCard({ icon, t, soil_moisture }) {
  return (
    <View style={styles.card}>
      {/* Sol Kolon */}
      <View style={styles.leftColumn}>
        <MaterialDesignIcons name={icon?.name} size={60} color={icon?.color} />
        <Text style={[styles.statusLabel, { color: icon?.color }]}>{t(icon?.label)} </Text>
      </View>

      {/* Orta Kolon */}
      <View style={styles.middleColumn}>
        <AnimatedCircularProgress
          size={70}
          width={8}
          fill={soil_moisture}
          tintColor={icon?.color}
          backgroundColor="#e0e0e0"
          rotation={0}
        >
          {(fill) => (
            <Text style={styles.percentageText}>{`${Math.round(fill)}%`}</Text>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* Sağ Kolon */}
      <View style={styles.rightColumn}>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 12,
  },
  leftColumn: {
    alignItems: 'center',
    flex: 1,
  },
  middleColumn: {
    alignItems: 'center',
    flex: 1,
  },
  rightColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statusLabel: {
    marginTop: 6,
    fontWeight: '600',
  },
  temperatureText: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: 'bold',
  },
  gaugeLabel: {
    marginBottom: 4,
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
  }
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BirdMetrics } from '../types';

interface MetricsDisplayProps {
  birdMetrics: BirdMetrics;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ birdMetrics }) => {
  const formatDistance = (distance: number): string => {
    if (distance < 24) {
      return `${distance}h`;
    }
    const days = Math.floor(distance / 24);
    const hours = distance % 24;
    return `${days}d ${hours}h`;
  };

  const getAltitudeColor = (altitude: number): string => {
    if (altitude <= 0) return '#E74C3C';
    if (altitude < 30) return '#F39C12';
    if (altitude < 70) return '#F1C40F';
    return '#27AE60';
  };

  const getFreedomDescription = (freedom: number): string => {
    if (freedom < 0.2) return '低';
    if (freedom < 0.5) return '中';
    if (freedom < 0.8) return '高';
    return '非常に高';
  };

  const getFreedomColor = (freedom: number): string => {
    if (freedom < 0.2) return '#E74C3C';
    if (freedom < 0.5) return '#F39C12';
    if (freedom < 0.8) return '#27AE60';
    return '#3498DB';
  };

  return (
    <View style={styles.container}>
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>飛行距離</Text>
          <Text style={styles.metricValue}>{formatDistance(birdMetrics.distance)}</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>高度</Text>
          <Text style={[styles.metricValue, { color: getAltitudeColor(birdMetrics.altitude) }]}>
            {Math.round(birdMetrics.altitude)}
          </Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>自由度</Text>
          <Text style={[styles.metricValue, { color: getFreedomColor(birdMetrics.freedom) }]}>
            {getFreedomDescription(birdMetrics.freedom)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    color: '#7F8C8D',
    fontWeight: '500',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
});

export default MetricsDisplay;

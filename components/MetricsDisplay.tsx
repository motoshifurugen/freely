import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BirdMetrics, UserProgress } from '../types';

interface MetricsDisplayProps {
  birdMetrics: BirdMetrics;
  userProgress: UserProgress;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ birdMetrics, userProgress }) => {
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
    if (freedom < 0.2) return 'Low';
    if (freedom < 0.5) return 'Moderate';
    if (freedom < 0.8) return 'High';
    return 'Very High';
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
          <Text style={styles.metricLabel}>Distance</Text>
          <Text style={styles.metricValue}>{formatDistance(birdMetrics.distance)}</Text>
          <Text style={styles.metricDescription}>Time flying</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Altitude</Text>
          <Text style={[styles.metricValue, { color: getAltitudeColor(birdMetrics.altitude) }]}>
            {Math.round(birdMetrics.altitude)}
          </Text>
          <Text style={styles.metricDescription}>Learning activity</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Freedom</Text>
          <Text style={[styles.metricValue, { color: getFreedomColor(birdMetrics.freedom) }]}>
            {getFreedomDescription(birdMetrics.freedom)}
          </Text>
          <Text style={styles.metricDescription}>Variability</Text>
        </View>
      </View>
      
      <View style={styles.progressRow}>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{userProgress.totalWordsLearned}</Text>
          <Text style={styles.progressLabel}>Words Learned</Text>
        </View>
        
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{userProgress.currentStreak}</Text>
          <Text style={styles.progressLabel}>Current Streak</Text>
        </View>
        
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>
            {userProgress.correctAnswers > 0 
              ? Math.round((userProgress.correctAnswers / (userProgress.correctAnswers + userProgress.incorrectAnswers)) * 100)
              : 0}%
          </Text>
          <Text style={styles.progressLabel}>Accuracy</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  metricDescription: {
    fontSize: 10,
    color: '#95A5A6',
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498DB',
    marginBottom: 2,
  },
  progressLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});

export default MetricsDisplay;

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { useAppStore } from './store/appStore';
import AnimatedBird from './components/AnimatedBird';
import WordCard from './components/WordCard';
import MetricsDisplay from './components/MetricsDisplay';

export default function App() {
  const {
    isLoading,
    currentBirdAnimation,
    birdMetrics,
    userProgress,
    getCurrentWord,
    answerWord,
    initializeApp,
  } = useAppStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const currentWord = getCurrentWord();

  useEffect(() => {
    const initialize = async () => {
      await initializeApp();
      setIsInitialized(true);
    };
    initialize();
  }, [initializeApp]);

  const handleAnswer = async (known: boolean) => {
    if (currentWord) {
      await answerWord(currentWord.id, known);
    }
  };

  if (!isInitialized || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={styles.loadingText}>Loading Freely...</Text>
      </View>
    );
  }

  if (!currentWord) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No words available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Bird Animation Area */}
      <View style={styles.birdArea}>
        <AnimatedBird
          animationState={currentBirdAnimation}
          altitude={birdMetrics.altitude}
          distance={birdMetrics.distance}
          freedom={birdMetrics.freedom}
          size={80}
        />
      </View>

      {/* Metrics Display */}
      <MetricsDisplay
        birdMetrics={birdMetrics}
        userProgress={userProgress}
      />

      {/* Learning Area */}
      <View style={styles.learningArea}>
        <WordCard
          word={currentWord}
          onAnswer={handleAnswer}
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA', // Soft beige/white background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7F8C8D',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  errorText: {
    fontSize: 18,
    color: '#E74C3C',
    textAlign: 'center',
  },
  birdArea: {
    height: 200,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  learningArea: {
    flex: 1,
    justifyContent: 'center',
  },
});

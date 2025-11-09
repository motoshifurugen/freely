import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Word, LearningRecord, UserProgress, BirdMetrics, BirdAnimationState } from '../types';
import vocabularyData from '../data/vocabulary.json';

const INITIAL_USER_PROGRESS: UserProgress = {
  totalWordsLearned: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: Date.now(),
};

const INITIAL_BIRD_METRICS: BirdMetrics = {
  distance: 0,
  altitude: 50, // Start at middle altitude
  freedom: 0.5,
  installDate: Date.now(),
  lastAltitudeUpdate: Date.now(),
  altitudeHistory: [{ timestamp: Date.now(), altitude: 50 }],
};

const calculateDistance = (installDate: number): number => {
  const timeSinceInstall = Date.now() - installDate;
  // Convert to a reasonable distance unit (e.g., 1 unit per hour)
  return Math.floor(timeSinceInstall / (1000 * 60 * 60));
};

const calculateAltitude = (
  currentAltitude: number,
  learningRecords: LearningRecord[],
  lastUpdate: number
): number => {
  const now = Date.now();
  const timeSinceUpdate = now - lastUpdate;
  const hoursInactive = timeSinceUpdate / (1000 * 60 * 60);
  
  // Decrease altitude due to inactivity (1 point per hour)
  let newAltitude = currentAltitude - hoursInactive;
  
  // Increase altitude based on recent learning activity
  const recentRecords = learningRecords.filter(
    record => record.timestamp > lastUpdate
  );
  
  // Each learning activity increases altitude
  const altitudeIncrease = recentRecords.length * 5;
  newAltitude += altitudeIncrease;
  
  // Clamp altitude between 0 and 100
  return Math.max(0, Math.min(100, newAltitude));
};

const calculateFreedom = (altitudeHistory: Array<{ timestamp: number; altitude: number }>): number => {
  if (altitudeHistory.length < 2) return 0.5;
  
  // Calculate variance in altitude over recent history
  const recentHistory = altitudeHistory.slice(-10); // Last 10 data points
  const altitudes = recentHistory.map(h => h.altitude);
  const mean = altitudes.reduce((sum, alt) => sum + alt, 0) / altitudes.length;
  const variance = altitudes.reduce((sum, alt) => sum + Math.pow(alt - mean, 2), 0) / altitudes.length;
  
  // Normalize variance to 0-1 scale (assuming max variance of 1000)
  const normalizedVariance = Math.min(variance / 1000, 1);
  
  // Freedom is higher with moderate variance, lower with too little or too much
  if (normalizedVariance < 0.1) return 0.2; // Too stable
  if (normalizedVariance > 0.8) return 0.3; // Too chaotic
  return normalizedVariance;
};

const getBirdAnimationState = (altitude: number, freedom: number): BirdAnimationState => {
  if (altitude <= 0) return 'hop';
  if (freedom < 0.2) return 'glide';
  return 'fly';
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      vocabulary: [],
      currentWordIndex: 0,
      learningRecords: [],
      userProgress: INITIAL_USER_PROGRESS,
      birdMetrics: INITIAL_BIRD_METRICS,
      isLoading: false,
      currentBirdAnimation: 'fly',

      // Actions
      loadVocabulary: async () => {
        set({ isLoading: true });
        try {
          // In a real app, you might fetch from an API
          // For now, we use the imported JSON data
          set({ vocabulary: vocabularyData as Word[], isLoading: false });
        } catch (error) {
          console.error('Failed to load vocabulary:', error);
          set({ isLoading: false });
        }
      },

      answerWord: async (wordId: number, known: boolean) => {
        const state = get();
        const newRecord: LearningRecord = {
          wordId,
          timestamp: Date.now(),
          known,
        };

        const updatedRecords = [...state.learningRecords, newRecord];
        const updatedProgress = {
          ...state.userProgress,
          totalWordsLearned: state.userProgress.totalWordsLearned + 1,
          correctAnswers: known 
            ? state.userProgress.correctAnswers + 1 
            : state.userProgress.correctAnswers,
          incorrectAnswers: !known 
            ? state.userProgress.incorrectAnswers + 1 
            : state.userProgress.incorrectAnswers,
          currentStreak: known 
            ? state.userProgress.currentStreak + 1 
            : 0,
          longestStreak: known 
            ? Math.max(state.userProgress.longestStreak, state.userProgress.currentStreak + 1)
            : state.userProgress.longestStreak,
          lastActiveDate: Date.now(),
        };

        // Move to next word
        const nextWordIndex = (state.currentWordIndex + 1) % state.vocabulary.length;

        set({
          learningRecords: updatedRecords,
          userProgress: updatedProgress,
          currentWordIndex: nextWordIndex,
        });

        // Update bird metrics after answering
        get().updateBirdMetrics();
      },

      updateBirdMetrics: () => {
        const state = get();
        const now = Date.now();
        
        const newDistance = calculateDistance(state.birdMetrics.installDate);
        const newAltitude = calculateAltitude(
          state.birdMetrics.altitude,
          state.learningRecords,
          state.birdMetrics.lastAltitudeUpdate
        );
        
        const updatedAltitudeHistory = [
          ...state.birdMetrics.altitudeHistory,
          { timestamp: now, altitude: newAltitude }
        ].slice(-20); // Keep only last 20 entries
        
        const newFreedom = calculateFreedom(updatedAltitudeHistory);
        const newAnimationState = getBirdAnimationState(newAltitude, newFreedom);

        set({
          birdMetrics: {
            ...state.birdMetrics,
            distance: newDistance,
            altitude: newAltitude,
            freedom: newFreedom,
            lastAltitudeUpdate: now,
            altitudeHistory: updatedAltitudeHistory,
          },
          currentBirdAnimation: newAnimationState,
        });
      },

      getCurrentWord: () => {
        const state = get();
        if (state.vocabulary.length === 0) return null;
        return state.vocabulary[state.currentWordIndex];
      },

      resetProgress: async () => {
        set({
          learningRecords: [],
          userProgress: INITIAL_USER_PROGRESS,
          birdMetrics: {
            ...INITIAL_BIRD_METRICS,
            installDate: Date.now(),
          },
          currentWordIndex: 0,
          currentBirdAnimation: 'fly',
        });
      },

      initializeApp: async () => {
        const state = get();
        await state.loadVocabulary();
        state.updateBirdMetrics();
      },
    }),
    {
      name: 'freely-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain parts of the state
      partialize: (state) => ({
        learningRecords: state.learningRecords,
        userProgress: state.userProgress,
        birdMetrics: state.birdMetrics,
        currentWordIndex: state.currentWordIndex,
      }),
    }
  )
);

export interface Word {
  id: number;
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
}

export interface LearningRecord {
  wordId: number;
  timestamp: number;
  known: boolean;
}

export interface UserProgress {
  totalWordsLearned: number;
  correctAnswers: number;
  incorrectAnswers: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: number;
}

export interface BirdMetrics {
  distance: number; // Time since install (constant horizontal movement)
  altitude: number; // Based on learning activity and login frequency
  freedom: number; // Degree of altitude fluctuation (0-1)
  installDate: number;
  lastAltitudeUpdate: number;
  altitudeHistory: Array<{ timestamp: number; altitude: number }>;
}

export type BirdAnimationState = 'fly' | 'glide' | 'hop';

export interface AppState {
  // Data
  vocabulary: Word[];
  currentWordIndex: number;
  learningRecords: LearningRecord[];
  userProgress: UserProgress;
  birdMetrics: BirdMetrics;
  
  // UI State
  isLoading: boolean;
  currentBirdAnimation: BirdAnimationState;
  
  // Actions
  loadVocabulary: () => Promise<void>;
  answerWord: (wordId: number, known: boolean) => Promise<void>;
  updateBirdMetrics: () => void;
  getCurrentWord: () => Word | null;
  resetProgress: () => Promise<void>;
  initializeApp: () => Promise<void>;
}

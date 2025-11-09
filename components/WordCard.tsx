import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Word } from '../types';

interface WordCardProps {
  word: Word;
  onAnswer: (known: boolean) => void;
  isLoading?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

const WordCard: React.FC<WordCardProps> = ({ word, onAnswer, isLoading = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.wordSection}>
          <Text style={styles.word}>{word.word}</Text>
          <Text style={styles.pronunciation}>{word.pronunciation}</Text>
        </View>
        
        <View style={styles.meaningSection}>
          <Text style={styles.meaning}>{word.meaning}</Text>
        </View>
        
        <View style={styles.exampleSection}>
          <Text style={styles.exampleLabel}>Example:</Text>
          <Text style={styles.example}>"{word.example}"</Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.unknownButton]}
          onPress={() => onAnswer(false)}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.unknownButtonText]}>
            I don't know
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.knownButton]}
          onPress={() => onAnswer(true)}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.knownButtonText]}>
            I know this
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    marginBottom: 40,
    width: screenWidth - 40,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  wordSection: {
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 20,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  pronunciation: {
    fontSize: 16,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  meaningSection: {
    marginBottom: 25,
  },
  meaning: {
    fontSize: 18,
    color: '#34495E',
    lineHeight: 26,
    textAlign: 'center',
  },
  exampleSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
  },
  exampleLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
    marginBottom: 8,
  },
  example: {
    fontSize: 16,
    color: '#2C3E50',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth - 40,
    maxWidth: 400,
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  unknownButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E74C3C',
  },
  knownButton: {
    backgroundColor: '#27AE60',
    borderWidth: 2,
    borderColor: '#27AE60',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  unknownButtonText: {
    color: '#E74C3C',
  },
  knownButtonText: {
    color: '#FFFFFF',
  },
});

export default WordCard;

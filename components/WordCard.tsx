import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Word } from '../types';

interface WordCardProps {
  word: Word;
  onAnswer: (known: boolean) => void;
  isLoading?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

const WordCard: React.FC<WordCardProps> = ({ word, onAnswer, isLoading = false }) => {
  const [isMeaningVisible, setIsMeaningVisible] = useState(false);

  // Reset meaning visibility when word changes
  useEffect(() => {
    setIsMeaningVisible(false);
  }, [word.id]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.wordSection}>
          <Text style={styles.word}>{word.word}</Text>
          <Text style={styles.pronunciation}>{word.pronunciation}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.meaningSection}
          onPress={() => setIsMeaningVisible(!isMeaningVisible)}
          activeOpacity={0.7}
        >
          {isMeaningVisible ? (
            <ScrollView
              style={styles.meaningScrollView}
              contentContainerStyle={styles.meaningScrollContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.meaning}>{word.meaning}</Text>
              <View style={styles.exampleSection}>
                <Text style={styles.exampleLabel}>例:</Text>
                <Text style={styles.example}>"{word.example}"</Text>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.meaningPlaceholder}>
              <Text style={styles.meaningPlaceholderText}>タップして訳を表示</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.unknownButton]}
          onPress={() => onAnswer(false)}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.unknownButtonText]}>
            わからない
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.knownButton]}
          onPress={() => onAnswer(true)}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.knownButtonText]}>
            わかる
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
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
    marginTop: 20,
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
    flex: 1,
    minHeight: 100,
    maxHeight: 300,
  },
  meaningScrollView: {
    flex: 1,
  },
  meaningScrollContent: {
    paddingVertical: 10,
  },
  meaning: {
    fontSize: 18,
    color: '#34495E',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 20,
  },
  meaningPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  meaningPlaceholderText: {
    fontSize: 16,
    color: '#95A5A6',
    fontStyle: 'italic',
  },
  exampleSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
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
    marginBottom: 30,
    paddingTop: 20,
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

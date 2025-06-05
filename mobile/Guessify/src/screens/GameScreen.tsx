import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenBanner from '../components/banners/ScreenBanner';
import GreenButton from '../components/buttons/GreenButton';
import { useGame } from '../context/GameContext';
import { useNavigation } from '@react-navigation/native';

const GameScreen = () => {
  const { question, selectedAnswer, submitAnswer, finishRound, currentRound, gameState } = useGame();
  const navigation = useNavigation();

  useEffect(() => {
    if (gameState === 'results') {
      navigation.navigate('Answer');
    }
  }, [gameState]);

  if (!question) return null;

  const handleOptionSelect = (option: string) => {
    if (!selectedAnswer) {
      submitAnswer(option);
      setTimeout(finishRound, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <ScreenBanner title={`ROUND ${currentRound}`} />
      </View>

      <View style={styles.section}>
        <Text style={styles.questionText}>What song is this?</Text>
        <Text style={styles.song}>🎵 {question.song} 🎵</Text>

        {question.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedAnswer === option && styles.selectedOption,
            ]}
            onPress={() => handleOptionSelect(option)}
            disabled={!!selectedAnswer}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}

        {selectedAnswer && (
          <Text style={styles.waiting}>Waiting for others...</Text>
        )}
      </View>

    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  section: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  questionText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  song: {
    fontSize: 20,
    color: '#ccc',
    marginBottom: 40,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  waiting: {
    marginTop: 20,
    color: '#aaa',
  },
});

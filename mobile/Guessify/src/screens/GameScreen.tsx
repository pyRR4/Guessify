import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenBanner from '../components/banners/ScreenBanner';
import GameQuestion from '../components/forms/GameQuestion';
import GreenButton from '../components/buttons/GreenButton';
import { useAuth } from '../context/AuthContext';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useGame } from '../context/GameContext';

type GameScreenParams = {
  GameScreen: {
    gameMode?: 'title' | 'author' | 'user';
  };
};

const GameScreen = () => {
  const { user } = useAuth();
  const route = useRoute<RouteProp<GameScreenParams, 'GameScreen'>>();

  const gameMode = route.params?.gameMode ?? 'title';

  const {
    score,
    setScore,
    round,
    setRound,
  } = useGame();

  const promptByMode = {
    title: 'Guess the Title',
    author: 'Guess the Author',
    user: 'Guess Who Picked It',
  };

  const [answers, setAnswers] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');

  useEffect(() => {
    const possibleAnswers = ['Answer A', 'Answer B', 'Answer C', 'Answer D'];
    const correct = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];

    const shuffled = [...possibleAnswers].sort(() => Math.random() - 0.5);

    setAnswers(shuffled);
    setCorrectAnswer(correct);
  }, [round]);

  const handleAnswer = (isCorrect: boolean, selected: string) => {
    console.log(`User selected "${selected}" — ${isCorrect ? 'Correct!' : 'Wrong!'}`);
    if (isCorrect) {
      setScore(score + 1);
    }
    setRound(round + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <ScreenBanner title={`ROUND ${round}`} />
      </View>

      <View style={styles.section}>
        <GameQuestion
          questionText={promptByMode[gameMode]}
          answers={answers}
          correctAnswer={correctAnswer}
          onAnswer={handleAnswer}
        />
      </View>

      <GreenButton title="Next" screen="GameScreen" />
    </View>
  );
};

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
});

export default GameScreen;

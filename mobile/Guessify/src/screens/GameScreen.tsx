import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenBanner from '../components/banners/ScreenBanner';
import GameQuestion from '../components/forms/GameQuestion';
import GreenButton from '../components/buttons/GreenButton'
import { useAuth } from '../context/AuthContext';
import { useRoute, RouteProp } from '@react-navigation/native';

type GameScreenParams = {
  GameScreen: {
    gameMode?: 'title' | 'author' | 'user';
    roundNumber?: number;
  };
};

const GameScreen = () => {
  const { user } = useAuth();
  const route = useRoute<RouteProp<GameScreenParams, 'GameScreen'>>();

  const gameMode = route.params?.gameMode ?? 'title';
  const roundNumber = route.params?.roundNumber ?? 1;

  const promptByMode = {
    title: 'Guess the Title',
    author: 'Guess the Author',
    user: 'Guess Who Picked It',
  };

  const answers = ['Answer A', 'Answer B', 'Answer C', 'Answer D'];
  const correctAnswer = 'Answer B';

  const handleAnswer = (isCorrect: boolean, selected: string) => {
    console.log(`User selected "${selected}" — ${isCorrect ? 'Correct!' : 'Wrong!'}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <ScreenBanner title={`ROUND ${roundNumber}`} />
      </View>

      <View style={styles.section}>
        <GameQuestion
          questionText={promptByMode[gameMode]}
          answers={answers}
          correctAnswer={correctAnswer}
          onAnswer={handleAnswer}
        />
      </View>
      <GreenButton title="Guess" screen="WaitingGameScreen"/>
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

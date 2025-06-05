import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import ScreenBanner from '../components/banners/ScreenBanner';
import PlayerScoreList from '../components/lists/PlayerScoreList';
import { useGame } from '../context/GameContext';

const CurrentScoreScreen = () => {
  const { players, question, startNextRound } = useGame();

  useEffect(() => {
    const timer = setTimeout(() => {
      startNextRound();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <View style={styles.container}>
      <ScreenBanner title="CURRENT SCORE" />

      {question?.correct && (
        <Text style={styles.correctAnswer}>
          Correct Answer: {question.correct}
        </Text>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <PlayerScoreList players={sorted} currentPlayer="PLAYER 4" />
      </ScrollView>
    </View>
  );
};

export default CurrentScoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    paddingTop: 50,
    gap: 30,
  },
  correctAnswer: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: -20,
  },
});

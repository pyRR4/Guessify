import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PlayerScoreList from '../components/lists/PlayerScoreList';
import ScreenBanner from '../components/banners/ScreenBanner';

const players = [
  { name: 'PLAYER 1', score: 3422 },
  { name: 'PLAYER 6', score: 2674 },
  { name: 'PLAYER 2', score: 1897 },
  { name: 'PLAYER 5', score: 1422 },
  { name: 'PLAYER 7', score: 988 },
  { name: 'PLAYER 3', score: 630 },
  { name: 'PLAYER 4', score: 320 },
  { name: 'PLAYER 8', score: 0 },
];

const CurrentScoreScreen = () => {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <View style={styles.container}>
      <ScreenBanner title="CURRENT SCORE" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <PlayerScoreList players={sorted} currentPlayer="PLAYER 4" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    paddingTop: 50,
    gap: 30,
  },
  button: {
    backgroundColor: '#00C853',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CurrentScoreScreen;

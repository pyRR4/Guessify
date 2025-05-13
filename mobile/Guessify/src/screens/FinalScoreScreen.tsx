import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PlayerScoreList from '../components/lists/PlayerScoreList';
import ScreenBanner from '../components/banners/ScreenBanner';
import PodiumBanner from '../components/banners/PodiumBanner';
import GreenButton from '../components/buttons/GreenButton';

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

const FinalScoreScreen = () => {

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const [first, second, third, ...rest] = sortedPlayers;

  return (
    <View style={styles.container}>
      <ScreenBanner title="FINAL SCORE" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40, alignItems: 'center', gap: 20 }}>
        <PodiumBanner first={first} second={second} third={third} />
        <PlayerScoreList players={rest} startFrom={4} />
      </ScrollView>
      <GreenButton title="Return" screen="" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    paddingTop: 30,
    gap: 20,
  },

});

export default FinalScoreScreen;

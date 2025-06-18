import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import PlayerScoreList from '../components/lists/PlayerScoreList';
import ScreenBanner from '../components/banners/ScreenBanner';
import PodiumBanner from '../components/banners/PodiumBanner';
import GreenButton from '../components/buttons/GreenButton';
import { useGame } from '../context/GameContext';
import { fetchLeaderboard } from '../api/game';

const FinalScoreScreen = ({ navigation }: any) => {
  const { roomCode } = useGame();
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomCode) return;
    fetchLeaderboard(roomCode)
      .then(setPlayers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [roomCode]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0f0" />
        <Text style={styles.text}>Loading final scores...</Text>
      </View>
    );
  }

  const defaultPlayer = { name: '-', score: 0 };
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const [first, second, third, ...rest] = [
    sortedPlayers[0] ?? defaultPlayer,
    sortedPlayers[1] ?? defaultPlayer,
    sortedPlayers[2] ?? defaultPlayer,
    ...sortedPlayers.slice(3),
  ];

  return (
    <View style={styles.container}>
      <ScreenBanner title="FINAL SCORE" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40, alignItems: 'center', gap: 20 }}>
        <PodiumBanner first={first} second={second} third={third} />
        <PlayerScoreList players={rest} startFrom={4} />
      </ScrollView>
      
      <GreenButton title="Return" onPress={() => navigation.navigate('Home')} />
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default FinalScoreScreen;

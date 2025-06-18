import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../context/GameContext';

const RoundNumberScreen = () => {
  const navigation = useNavigation<any>();
  const { currentRound, gameOptions, question } = useGame();

  const roundNumber = currentRound + 1;
  const totalRounds = gameOptions.numberOfRounds;
  const gameMode = gameOptions.gameGoal;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('GameScreen');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/guessify.png')} style={styles.logo} />
      <Text style={styles.text}>{`ROUND ${roundNumber} / ${totalRounds}`}</Text>
      <Text style={styles.text}>Get Ready for {formatGameMode(gameMode)}!</Text>
    </View>
  );
};

const formatGameMode = (mode: string) => {
  switch (mode) {
    case 'GUESS_THE_TITLE':
      return 'GUESS THE TITLE';
    case 'GUESS_THE_ARTIST':
      return 'GUESS THE ARTIST';
    case 'GUESS_THE_USER':
      return 'GUESS WHO PICKED THIS SONG';
    default:
      return '';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoundNumberScreen;

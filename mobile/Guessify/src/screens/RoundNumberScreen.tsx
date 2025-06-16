import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useGame } from '../context/GameContext';

type Params = {
  RoundNumber: {
    roundNumber: number;
  };
};

const RoundNumberScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<Params, 'RoundNumber'>>();
  const { gameOptions } = useGame();

  const roundNumber = route.params?.roundNumber ?? 1;
  const totalRounds = gameOptions.numberOfRounds;
  const gameMode = gameOptions.gameGoal;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('GameScreen', {
        roundNumber,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, roundNumber]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/guessify.png')} style={styles.logo} />
      <Text style={styles.text}>{`ROUND ${roundNumber} / ${totalRounds}`}</Text>
      <Text style={styles.text}>Get Ready for {gameMode}!</Text>
    </View>
  );
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
  spinner: {
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoundNumberScreen;

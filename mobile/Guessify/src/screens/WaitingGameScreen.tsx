import React, { useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

const WaitingGameScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/guessify.png')} style={styles.logo} />
      <Text style={styles.text}>{`Waiting for other Players`}</Text>
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

export default WaitingGameScreen;

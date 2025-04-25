import React, { useState } from 'react';
import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import CenteredText from '../components/texts/CenteredText';
import GreenButton from '../components/buttons/GreenButton';

const LoggedInHomeScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={require('../assets/guessify.png')} style={styles.logo} />

        <CenteredText>Logged in as</CenteredText>
        <CenteredText size={18}>{user?.toUpperCase()}</CenteredText>

        <View style={styles.section}>
          <GreenButton title="Change account" screen="Home" variant="secondary"/>
        </View>

        <View style={styles.section}>
          <CenteredText>Start guessing:</CenteredText>
          <GreenButton title="Join room" screen="JoinRoom" />
          <GreenButton title="Create room" screen="" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    gap: 25,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  section: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },

});

export default LoggedInHomeScreen;

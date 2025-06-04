import React from 'react';
import { ScrollView,View, Image, StyleSheet } from 'react-native';
import GreenButton from '../components/buttons/GreenButton';
import CenteredText from '../components/texts/CenteredText';

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={require('../assets/guessify.png')} style={styles.logo} />
    
        <View style={styles.section}>
          <CenteredText>
            Welcome to Guessify! To use all features, connect your Spotify account.
          </CenteredText>
          <GreenButton title="Log in via Spotify" screen="LoggedInHome" />
        </View>

        <View style={styles.section}>
          <CenteredText>Or just start guessing!</CenteredText>
          <GreenButton title="Join Room" screen="JoinRoom" />
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
    gap: 60,
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


export default HomeScreen;

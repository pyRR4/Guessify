import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ScreenBanner from '../components/banners/ScreenBanner';
import GreenButton from '../components/buttons/GreenButton';
import CenteredText from '../components/texts/CenteredText';
import RadioGroup from '../components/forms/RadioGroup';

const CreateRoom1Screen = ({ navigation }: any) => {
  const [songSource, setSongSource] = useState('Spotify');
  const [gameGoal, setGameGoal] = useState('Guess the Title');

  const mapSongSource = (text: string) => {
    if (text === 'Spotify') return 'SPOTIFY';
    if (text === 'Host') return 'HOST';
    return 'PLAYERS';
  };

  const mapGameGoal = (text: string) => {
    if (text === 'Guess the Title') return 'TITLE';
    if (text === 'Guess the Author') return 'AUTHOR';
    return 'USER';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <ScreenBanner title="GAME MODE" />
        </View>

        <View style={styles.section}>
          <CenteredText>Source of Songs</CenteredText>
          <RadioGroup
            options={['Spotify', 'Host', 'Players']}
            selected={songSource}
            onSelect={setSongSource}
          />
        </View>
        <View style={styles.section}>
          <CenteredText>Game Goal</CenteredText>
          <RadioGroup
            options={['Guess the Title', 'Guess the Author', 'Guess the User']}
            selected={gameGoal}
            onSelect={setGameGoal}
          />

        </View>

        <View style={styles.section}>
          <GreenButton
            title="Continue"
            onPress={() => navigation.navigate('CreateRoom2', {
              songSource: mapSongSource(songSource),
              gameMode: mapGameGoal(gameGoal),
            })}
          />
          <GreenButton title="Back" screen="LoggedInHome" variant="secondary"/>
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
  section: {
      alignItems: 'center',
      marginBottom: 30,
      width: '100%',
    },
});

export default CreateRoom1Screen;

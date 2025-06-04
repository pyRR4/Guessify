import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ScreenBanner from '../components/banners/ScreenBanner';
import GreenButton from '../components/buttons/GreenButton';
import CenteredText from '../components/texts/CenteredText';
import RadioGroup from '../components/forms/RadioGroup';

const CreateRoom2Screen = ({ navigation, route }: any) => {
  const [timeToAnswer, setTimeToAnswer] = useState('15 sec');
  const [numberOfRounds, setNumberOfRounds] = useState('20 songs');
  const [playbackLength, setPlaybackLength] = useState('15 sec');
  const { songSource, gameMode } = route.params;
  const parseSeconds = (value: string) => parseInt(value.split(' ')[0]);
  const parseSongs = (value: string) => parseInt(value.split(' ')[0]);


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <ScreenBanner title="GAME SETTINGS" />
        </View>

        <View style={styles.section}>
          <CenteredText>Time to Answer</CenteredText>
          <RadioGroup
            options={['10 sec', '15 sec', '30 sec']}
            selected={timeToAnswer}
            onSelect={setTimeToAnswer}
          />
        </View>
        <View style={styles.section}>
          <CenteredText>Number of Rounds</CenteredText>
          <RadioGroup
            options={['10 songs', '20 songs', '30 songs']}
            selected={numberOfRounds}
            onSelect={setNumberOfRounds}
          />
        </View>
        <View style={styles.section}>
          <CenteredText>Playback Length</CenteredText>
          <RadioGroup
            options={['10 sec', '15 sec', '30 sec']}
            selected={playbackLength}
            onSelect={setPlaybackLength}
          />
        </View>

        <View style={styles.section}>
          <GreenButton
            title="Create room"
            onPress={() => navigation.navigate('CreateRoom3', {
              songSource,
              gameMode,
              answerTimeSeconds: parseSeconds(timeToAnswer),
              roundsNumber: parseSongs(numberOfRounds),
              playbackLength: parseSeconds(playbackLength),
            })}
          />
          <GreenButton title="Back" screen="CreateRoom1" variant="secondary"/>
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

export default CreateRoom2Screen;

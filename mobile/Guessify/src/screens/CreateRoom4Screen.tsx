import React from 'react';
import { ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import ScreenBanner from '../components/banners/ScreenBanner';
import PlayerList from '../components/lists/PlayerList';
import GreenButton from '../components/buttons/GreenButton';
import CenteredText from '../components/texts/CenteredText';
import Input from '../components/forms/Input'
import ShareField from '../components/forms/ShareField';

const CreateRoom4Screen = ({ route, navigation }: any) => {

  const { roomId, password, players = [] } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenBanner title="GAME ROOM" />

        <CenteredText>
          Players {players.length}/10
        </CenteredText>
        <PlayerList players={players} />
        <CenteredText> Sharing the Room </CenteredText>
        <ShareField value={roomId} />
        <ShareField value={password} />

        <View style={styles.section}>
          <GreenButton
            title="Start the Game"
            screen="RoundNumber"
            params={{ roundNumber: 1, gameMode: 'TITLE' }}
          />
          <GreenButton title="Close the room" screen="LoggedInHome" variant="secondary"/>
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
      gap: 20,
  },
  section: {
      alignItems: 'center',
      marginBottom: 30,
      width: '100%',
    },
});

export default CreateRoom4Screen;

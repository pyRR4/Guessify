import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import ScreenBanner from '../components/banners/ScreenBanner';
import GreenButton from '../components/buttons/GreenButton';
import CenteredText from '../components/texts/CenteredText';
import Input from '../components/forms/Input';
import { createRoom } from '../api/createRoom';
import { useAuth } from '../context/AuthContext';

const CreateRoom3Screen = ({ navigation, route }: any) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { user } = useAuth();
  const hostName = user?.username || 'PLAYER';

  const {
      maxPlayers = 10,
      songSource,
      gameMode,
      answerTimeSeconds,
      roundsNumber,
      playbackLength,
    } = route.params;

    const handleCreateRoom = async () => {
      if (password.trim() === '') {
        setError('Password cannot be empty');
        return;
      }

      setError('');

      const payload = {
        hostName,
        maxPlayers,
        songSource,
        gameMode,
        answerTimeSeconds,
        roundsNumber,
        playbackLength,
        roomPasswordHash: password,
      };

      try {
        const response = await createRoom(payload);
        navigation.navigate('CreateRoom4', {
          roomId: response.roomId,
          password,
          players: [hostName], // na razie lokalnie tylko host
        });
      } catch (e) {
        console.error('Room creation failed', e);
      }
    };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <ScreenBanner title="SECURE ROOM" />
        </View>

        <View style={styles.section}>
          <CenteredText>Create Password for your Room</CenteredText>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="password"
          />
          {error !== '' && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.section}>
          <GreenButton title="Launch your Room" onPress={handleCreateRoom} />
          <GreenButton title="Back" screen="CreateRoom2" variant="secondary"/>
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
      gap: 110,
  },
  section: {
      alignItems: 'center',
      marginBottom: 30,
      width: '100%',
  },
  error: {
      color: 'red',
      marginTop: 10,
      fontSize: 14,
  },
});

export default CreateRoom3Screen;

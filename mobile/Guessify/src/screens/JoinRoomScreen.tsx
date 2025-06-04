import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import ScreenBanner from '../components/banners/ScreenBanner';
import Input from '../components/forms/Input';
import GreenButton from '../components/buttons/GreenButton';
import CenteredText from '../components/texts/CenteredText';
import { useAuth } from '../context/AuthContext';

const JoinRoomScreen = ({ navigation }: any) => {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const { user } = useAuth();

  const handleJoinRoom = () => {
    if (roomId.trim() === '' || password.trim() === '') {
      setError('Both fields are required');
      return;
    }

    setError('');

    // TODO: dodaj tu wywołanie backendu (fetch/axios), np. joinRoom({ roomId, password, user })
    navigation.navigate('WaitingRoom', {
      roomId,
      username: user?.username,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <ScreenBanner title="JOIN ROOM" />
        </View>

        <View style={styles.section}>
          <CenteredText>Enter Room ID</CenteredText>
          <Input
            value={roomId}
            onChangeText={setRoomId}
            placeholder="09dyj03km"
          />
          <CenteredText>Enter Password</CenteredText>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry
          />
          {error !== '' && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.section}>
          <GreenButton title="Join" onPress={handleJoinRoom} />
          <GreenButton title="Back" screen="Home" variant="secondary"/>
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
      gap: 40,
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

export default JoinRoomScreen;

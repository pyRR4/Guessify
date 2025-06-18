import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import ScreenBanner from '../components/banners/ScreenBanner';
import PlayerList from '../components/lists/PlayerList';
import GreenButton from '../components/buttons/GreenButton';
import CenteredText from '../components/texts/CenteredText';
import { getPlayersInRoom } from '../api/room';
import { connectToSocket } from '../services/socketService';

const WaitingRoomScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { roomId } = route.params;

  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await getPlayersInRoom(roomId);
        setPlayers(response);
      } catch (e) {
        console.error('Failed to fetch players:', e);
      }
    };

    fetchPlayers();
    const interval = setInterval(fetchPlayers, 5000);
    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    // Subskrypcja WebSocket na start gry
    connectToSocket(roomId, (data) => {
      if (data.playlistId) {
        console.log('🎮 Gra rozpoczęta!');
        navigation.navigate('RoundNumber', {
          roundNumber: 1,
          playlistId: data.playlistId,
        });
      }
    });
  }, [roomId]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenBanner title="GAME ROOM" />

        <CenteredText>
          Players {players.length}/10
        </CenteredText>
        <PlayerList players={players} />
        <CenteredText> Wait until the Host starts the game</CenteredText>

        <GreenButton title="Leave the Room" screen="Home" variant="secondary" />
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

export default WaitingRoomScreen;

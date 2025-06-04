import React from 'react';
import { ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import ScreenBanner from '../components/banners/ScreenBanner';
import PlayerList from '../components/lists/PlayerList';
import GreenButton from '../components/buttons/GreenButton';
import CenteredText from '../components/texts/CenteredText';
import Input from '../components/forms/Input'
import ShareField from '../components/forms/ShareField';
import { getPlayersInRoom } from '../api/room';

const WaitingRoomScreen = () => {
  const route = useRoute<any>();
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

      // Opcjonalnie: odświeżaj listę co kilka sekund
      const interval = setInterval(fetchPlayers, 5000);
      return () => clearInterval(interval);
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
        <GreenButton title="Leave the Room" screen="Home" variant="secondary"/>

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

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Player {
  id: number;
  username: string;
  avatarUrl?: string;
}

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <View style={styles.listContainer}>
      {players.map((player) => (
        <View key={player.id} style={styles.playerItem}>
          <View style={styles.playerInfo}>
            {player.avatarUrl ? (
              <Image source={{ uri: player.avatarUrl }} style={styles.avatar} />
            ) : (
              <Icon name="person-circle-outline" size={32} color="#fff" />
            )}
            <Text style={styles.playerName}>{player.username}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    width: '80%',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#fff',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PlayerList;

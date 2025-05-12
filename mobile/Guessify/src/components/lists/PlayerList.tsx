import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface PlayerListProps {
  players: string[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <View style={styles.listContainer}>
      {players.map((player, index) => (
        <View key={index} style={styles.playerItem}>
          <Text style={styles.playerName}>{player}</Text>
          <Icon name="person-circle-outline" size={24} color="#fff" />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    width: '80%',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#fff',
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PlayerList;

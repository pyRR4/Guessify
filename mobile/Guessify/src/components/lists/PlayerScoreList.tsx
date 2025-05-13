import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Player {
  name: string;
  score: number;
}

interface PlayerScoreListProps {
  players: Player[];
  currentPlayer?: string;
  startFrom?: number;
}

const PlayerScoreList: React.FC<PlayerScoreListProps> = ({ players, currentPlayer, startFrom = 1 }) => {
  return (
    <View style={styles.listContainer}>
      {players.map((player, index) => {
        const isCurrent = player.name === currentPlayer;

        return (
          <View
            key={index}
            style={[
              styles.playerItem,
              isCurrent && styles.highlighted,
            ]}
          >
            <Text style={styles.position}>#{index + startFrom}</Text>

            <View style={styles.playerNameBox}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Icon name="person-circle-outline" size={20} color="#fff" />
            </View>

            <Text style={styles.score}>{player.score}</Text>
          </View>
        );
      })}
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
    width: '85%',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#fff',
  },
  highlighted: {
    borderColor: '#BB86FC',
    borderWidth: 2,
  },
  position: {
    color: '#fff',
    fontSize: 14,
    width: 32,
  },
  playerNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  score: {
    color: '#fff',
    fontSize: 14,
    width: 50,
    textAlign: 'right',
  },
});

export default PlayerScoreList;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Player {
  name: string;
  score: number;
}

interface PodiumProps {
  first: Player;
  second: Player;
  third: Player;
}

const PodiumBanner: React.FC<PodiumProps> = ({ first, second, third }) => {
  return (
    <View style={styles.podiumRow}>
      {/* 2nd place */}
      <View style={styles.podiumItem}>
        <Ionicons name="person-circle-outline" size={24} color="#fff" />
        <Text style={styles.playerName}>{second.name}</Text>
        <View style={[styles.podiumBase, styles.second]}>
          <Text style={styles.place}>2</Text>
        </View>
        <Text style={styles.score}>{second.score}</Text>
      </View>

      {/* 1st place */}
      <View style={styles.podiumItem}>
        <Ionicons name="person-circle-outline" size={24} color="#fff" />
        <Text style={styles.playerName}>{first.name}</Text>
        <View style={[styles.podiumBase, styles.first]}>
          <Text style={styles.place}>1</Text>
        </View>
        <Text style={styles.score}>{first.score}</Text>
      </View>

      {/* 3rd place */}
      <View style={styles.podiumItem}>
        <Ionicons name="person-circle-outline" size={24} color="#fff" />
        <Text style={styles.playerName}>{third.name}</Text>
        <View style={[styles.podiumBase, styles.third]}>
          <Text style={styles.place}>3</Text>
        </View>
        <Text style={styles.score}>{third.score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 30,
  },
  podiumItem: {
    alignItems: 'center',
    width: '30%',
    gap: 4,
  },
  podiumBase: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  place: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  first: { backgroundColor: '#FFD700' },
  second: { backgroundColor: '#C0C0C0' },
  third: { backgroundColor: '#CD7F32' },
  playerName: {
    color: '#fff',
    fontSize: 12,
  },
  score: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PodiumBanner;

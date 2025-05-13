import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenBanner from '../components/banners/ScreenBanner';

interface AnswerScreenProps {
  title: string;
  author: string;
  player: string;
  imageUrl?: string;
  onClose?: () => void;
}

const AnswerScreen: React.FC<AnswerScreenProps> = ({ title, author, player, imageUrl, onClose }) => {
  return (
    <View style={styles.container}>
      <ScreenBanner title="ANSWER" />

      <View style={styles.imageWrapper}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={64} color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.answerBlock}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.value}>{title}</Text>
      </View>

      <View style={styles.answerBlock}>
        <Text style={styles.label}>Author</Text>
        <Text style={styles.value}>{author}</Text>
      </View>

      <View style={styles.answerBlock}>
        <Text style={styles.label}>Player</Text>
        <View style={styles.playerRow}>
          <Text style={styles.value}>{player}</Text>
          <Ionicons name="person-circle-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    paddingTop: 60,
    gap: 20,
  },
  answerButton: {
    backgroundColor: '#00C853',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  answerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageWrapper: {
    marginVertical: 10,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerBlock: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  label: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AnswerScreen;

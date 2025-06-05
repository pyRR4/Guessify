import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenBanner from '../components/banners/ScreenBanner';
import { useGame } from '../context/GameContext';
import { useNavigation } from '@react-navigation/native';


const AnswerScreen = () => {
  const {
    question,
    selectedAnswer,
    players,
    startNextRound,
    currentRound,
    gameState,
  } = useGame();

  const navigation = useNavigation();


  const isCorrect = selectedAnswer === question?.correct;

  useEffect(() => {
    const timer = setTimeout(() => {
      startNextRound();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (gameState === 'round') {
      navigation.navigate('GameScreen');
    }
    if (gameState === 'leaderboard') {
      navigation.navigate('FinalScore');
    }
  }, [gameState]);

  if (!question) return null;

  return (
    <View style={styles.container}>
      <ScreenBanner title={`Round ${currentRound + 1} Answer`} />

      <View style={styles.imageWrapper}>
        {/*TODO: OKLADKA ALBUMU*/}
        <Image
          source={require('../assets/guessify.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.answerBlock}>
        <Text style={styles.label}>Song</Text>
        <Text style={styles.value}>{question.song}</Text>
      </View>

      <View style={styles.answerBlock}>
        <Text style={styles.label}>Correct Artist</Text>
        <Text style={styles.value}>{question.correct}</Text>
      </View>

      <View style={styles.answerBlock}>
        <Text style={styles.label}>Your Answer</Text>
        <View style={styles.playerRow}>
          <Text
            style={[
              styles.value,
              { color: isCorrect ? '#4CAF50' : '#FF5252' },
            ]}
          >
            {selectedAnswer ?? 'No Answer'}
          </Text>
          <Ionicons
            name={isCorrect ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={isCorrect ? '#4CAF50' : '#FF5252'}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>


      <TouchableOpacity style={styles.nextButton} onPress={startNextRound}>
        <Text style={styles.nextButtonText}>Next Round</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AnswerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    paddingTop: 60,
    gap: 20,
  },
  imageWrapper: {
    marginVertical: 10,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: '#00C853',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

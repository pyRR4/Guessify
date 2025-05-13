import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface GameQuestionProps {
  questionText: string;
  answers: string[];
  correctAnswer: string;
  onAnswer?: (isCorrect: boolean, selected: string) => void;
}

const GameQuestion: React.FC<GameQuestionProps> = ({ questionText, answers, correctAnswer, onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handlePress = (answer: string) => {
    setSelected(answer);
    const isCorrect = answer === correctAnswer;
    onAnswer?.(isCorrect, answer);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{questionText}</Text>
      {answers.map((answer, index) => (
        <TouchableOpacity
          key={index}
          style={styles.answerButton}
          onPress={() => handlePress(answer)}
          activeOpacity={0.8}
        >
          <Text style={styles.answerText}>{answer}</Text>
          <View style={[styles.circle, selected === answer && styles.circleSelected]} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    width: '100%',
    alignItems: 'center',
  },
  question: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  answerButton: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerText: {
    color: '#fff',
    fontSize: 16,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  circleSelected: {
    backgroundColor: '#fff',
  },
});

export default GameQuestion;

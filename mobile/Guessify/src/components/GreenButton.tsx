import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface GreenButtonProps {
  title: string;
  screen: string;
}

const GreenButton: React.FC<GreenButtonProps> = ({ title, screen }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate(screen)}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00C853',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    marginVertical: 10,
    width: '60%',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default GreenButton;

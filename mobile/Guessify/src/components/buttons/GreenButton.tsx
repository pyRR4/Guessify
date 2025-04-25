import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface GreenButtonProps {
  title: string;
  screen: string;
  variant?: 'primary' | 'secondary';
}

const GreenButton: React.FC<GreenButtonProps> = ({ title, screen, variant = 'primary' }) => {
  const navigation = useNavigation<any>();
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: isPrimary ? '#00C853' : '#999' }]}
      onPress={() => navigation.navigate(screen)}
    >
      <Text style={[styles.text, { color: '#fff' }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    marginVertical: 10,
    width: '60%',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default GreenButton;

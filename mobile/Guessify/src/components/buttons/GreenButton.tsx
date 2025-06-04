import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface GreenButtonProps {
  title: string;
  screen: string;
  params?: object;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
}

const GreenButton: React.FC<GreenButtonProps> = ({ title, screen, params, onPress, variant = 'primary' }) => {
  const navigation = useNavigation<any>();
  const isPrimary = variant === 'primary';

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (screen){
      navigation.navigate(screen, params);
    } else {
      console.warn('GreenButton: No screen or onPress provided');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: isPrimary ? '#00C853' : '#999' }]}
      onPress={handlePress}
    >
      <Text style={styles.text}>{title}</Text>
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
    color: '#fff',
  },
});

export default GreenButton;

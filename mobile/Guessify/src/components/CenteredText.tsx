import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CenteredTextProps {
  children: string;
  color?: string;
  size?: number;
}

const CenteredText: React.FC<CenteredTextProps> = ({ children, color = '#fff', size = 20 }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color, fontSize: size }]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    width: '70%',
  },
  text: {
    fontWeight: 'semibold',
    textAlign: 'center',
  },
});

export default CenteredText;

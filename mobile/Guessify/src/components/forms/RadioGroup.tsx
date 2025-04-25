import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RadioGroupProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selected, onSelect }) => {
  return (
    <View style={styles.group}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={styles.option}
          onPress={() => onSelect(option)}
          activeOpacity={0.8}
        >
          <Text style={styles.label}>{option}</Text>
          <View style={[styles.circle, selected === option && styles.circleSelected]} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    width: '60%',
    gap: 12,
    marginTop: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
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
  label: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RadioGroup;

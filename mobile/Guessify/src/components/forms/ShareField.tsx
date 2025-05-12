import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';

interface ShareFieldProps {
  value: string;
}

const ShareField: React.FC<ShareFieldProps> = ({ value }) => {
  const copyToClipboard = () => {
    Clipboard.setString(value);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        editable={false}
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity onPress={copyToClipboard}>
        <Icon name="copy-outline" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#1A1A1A',
      width: '80%',
      borderRadius: 12,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#fff',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
});

export default ShareField;

import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ScreenBanner from '../components/banners/ScreenBanner';
import GreenButton from '../components/buttons/GreenButton';
import CenteredText from '../components/texts/CenteredText';
import Input from '../components/forms/Input';

const CreateRoom3Screen = ({ navigation }: any) => {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <ScreenBanner title="SECURE ROOM" />
        </View>

        <View style={styles.section}>
          <CenteredText>Create Password for your Room</CenteredText>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="password"
          />
        </View>

        <View style={styles.section}>
          <GreenButton title="Launch your Room" screen="CreateRoom4" />
          <GreenButton title="Back" screen="CreateRoom2" variant="secondary"/>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
      paddingVertical: 40,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
      gap: 110,
  },
  section: {
      alignItems: 'center',
      marginBottom: 30,
      width: '100%',
    },
});

export default CreateRoom3Screen;

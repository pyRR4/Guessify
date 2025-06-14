import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GreenButton from '../components/buttons/GreenButton';
import { useAuth } from '../context/AuthContext';

const PostLoginScreen = ({ navigation }: any) => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zalogowano jako: {user?.username}</Text>
      <Text style={styles.subtitle}>Kliknij poniżej aby wybrać playlistę:</Text>
      <GreenButton title="Wybierz playlistę" onPress={() => navigation.navigate('ChoosePlaylist')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 30,
  },
});

export default PostLoginScreen;

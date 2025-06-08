import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const AuthCallbackScreen = () => {
  const { login } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const handleCallback = async () => {
      const url = await Linking.getInitialURL();
      const code = url?.split('code=')[1];
      if (!code) return;

      try {
        const res = await fetch(`${API_URL}/api/auth/callback?code=${code}`);
        const user = await res.json();

        login({
          id: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl,
        });

        navigation.navigate('LoggedInHome');
      } catch (err) {
        console.error('Callback error:', err);
      }
    };

    handleCallback();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#00C853" />
    </View>
  );
};

export default AuthCallbackScreen;

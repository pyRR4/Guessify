import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import { useAuth } from '../context/AuthContext';

const useSpotifyCallback = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  useEffect(() => {
    const handleUrl = async (event: { url: string }) => {
      const url = event.url;
      const code = url.split('code=')[1];
      if (!code) return;
  
      try {
        const res = await fetch(`${API_URL}/api/auth/exchange?code=${code}`, {
          method: 'GET',
          credentials: 'include',
        });
        const user = await res.json();
  
        login({
          id: user.id,
          username: user.username,
          avatarUrl: user.avatarUrl,
          accessToken: user.accessToken,
        });
  
        navigation.navigate('LoggedInHome');
      } catch (err) {
        console.error('Login failed:', err);
      }
    };
  
    const sub = Linking.addEventListener('url', handleUrl);
  
    Linking.getInitialURL().then(url => {
      if (url?.startsWith('guessify://callback')) {
        handleUrl({ url });
      }
    });
  
    return () => sub.remove();
  }, []);
};

export default useSpotifyCallback;

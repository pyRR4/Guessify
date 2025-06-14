import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useSpotifyCallback = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleUrl = (event: { url: string }) => {
      if (event.url.startsWith('guessify://callback')) {
        navigation.navigate('PostLogin');
      }
    };

    const sub = Linking.addEventListener('url', handleUrl);
    Linking.getInitialURL().then(url => {
      if (url?.startsWith('guessify://callback')) {
        navigation.navigate('PostLogin');
      }
    });

    return () => sub.remove();
  }, []);
};

export default useSpotifyCallback;

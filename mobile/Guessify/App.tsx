import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator.tsx';
import LoadingScreen from './src/screens/LoadingScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext.tsx';
import { GameProvider } from './src/context/GameContext';

const linking = {
  prefixes: ['guessify://'],
  config: {
    screens: {
      LoggedInHome: 'callback', // or the name of the screen you navigate to
    },
  },
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <GameProvider>
            <NavigationContainer linking={linking}>
              <MainNavigator />
            </NavigationContainer>
          </GameProvider>
        )}
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

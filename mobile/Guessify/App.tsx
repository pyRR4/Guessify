import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator.tsx';
import LoadingScreen from './src/screens/LoadingScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext.tsx';
import { GameProvider } from './src/context/GameContext';

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
            <NavigationContainer>
              <MainNavigator />
            </NavigationContainer>
          </GameProvider>
        )}
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

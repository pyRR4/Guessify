import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator.tsx';
import LoadingScreen from './src/screens/LoadingScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext.tsx';

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
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        )}
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator.tsx';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext.tsx';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

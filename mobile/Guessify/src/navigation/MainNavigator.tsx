import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from '../screens/LoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import JoinRoomScreen from '../screens/JoinRoomScreen';
import LoggedInHomeScreen from '../screens/LoggedInHomeScreen';
import CreateRoom1Screen from '../screens/CreateRoom1Screen'
import CreateRoom2Screen from '../screens/CreateRoom2Screen'

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="JoinRoom" component={JoinRoomScreen} />
      <Stack.Screen name="LoggedInHome" component={LoggedInHomeScreen} />
      <Stack.Screen name="CreateRoom1" component={CreateRoom1Screen} />
      <Stack.Screen name="CreateRoom2" component={CreateRoom2Screen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from '../screens/LoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import JoinRoomScreen from '../screens/JoinRoomScreen';
import LoggedInHomeScreen from '../screens/LoggedInHomeScreen';
import CreateRoom1Screen from '../screens/CreateRoom1Screen'
import CreateRoom2Screen from '../screens/CreateRoom2Screen'
import CreateRoom3Screen from '../screens/CreateRoom3Screen'
import CreateRoom4Screen from '../screens/CreateRoom4Screen'
import WaitingRoomScreen from '../screens/WaitingRoomScreen'
import RoundNumberScreen from '../screens/RoundNumberScreen'
import GameScreen from '../screens/GameScreen'
import WaitingGameScreen from '../screens/WaitingGameScreen'
import AnswerScreen from '../screens/AnswerScreen'
import CurrentScoreScreen from '../screens/CurrentScoreScreen'
import FinalScoreScreen from '../screens/FinalScoreScreen'
import AuthCallbackScreen from '../screens/AuthCallbackScreen'
import PostLoginScreen from '../screens/PostLoginScreen';
import useSpotifyCallback from '../hooks/useSpotifyCallback';


const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  useSpotifyCallback()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AuthCallback" component={AuthCallbackScreen} />
      <Stack.Screen name="PostLogin" component={PostLoginScreen} />
      <Stack.Screen name="JoinRoom" component={JoinRoomScreen} />
      <Stack.Screen name="LoggedInHome" component={LoggedInHomeScreen} />
      <Stack.Screen name="CreateRoom1" component={CreateRoom1Screen} />
      <Stack.Screen name="CreateRoom2" component={CreateRoom2Screen} />
      <Stack.Screen name="CreateRoom3" component={CreateRoom3Screen} />
      <Stack.Screen name="CreateRoom4" component={CreateRoom4Screen} />
      <Stack.Screen name="WaitingRoom" component={WaitingRoomScreen} />
      <Stack.Screen name="RoundNumber" component={RoundNumberScreen} />
      <Stack.Screen name="GameScreen" component={GameScreen} />
      <Stack.Screen name="WaitingGameScreen" component={WaitingGameScreen} />
      <Stack.Screen name="Answer" component={AnswerScreen} />
      <Stack.Screen name="FinalScore" component={FinalScoreScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;

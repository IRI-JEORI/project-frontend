import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraCaptureScreen from '../screens/CameraCaptureScreen';
import HomeScreen from '../screens/HomeScreen';
import InviteCodeScreen from '../screens/InviteCodeScreen';
import LoginScreen from '../screens/LoginScreen';
import MoodCheckScreen from '../screens/MoodCheckScreen';
import PermissionScreen from '../screens/PermissionScreen';
import PersonalGroupScreen from '../screens/PersonalGroupScreen';
import PhotoReviewScreen from '../screens/PhotoReviewScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import WakeAlarmScreen from '../screens/WakeAlarmScreen';
import WakeGroupScreen from '../screens/WakeGroupScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Permission" component={PermissionScreen} />
      <Stack.Screen name="MoodCheck" component={MoodCheckScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PersonalGroup" component={PersonalGroupScreen} />
      <Stack.Screen name="InviteCode" component={InviteCodeScreen} />
      <Stack.Screen name="WakeGroupDetail" component={WakeGroupScreen} />
      <Stack.Screen name="WakeAlarm" component={WakeAlarmScreen} />
      <Stack.Screen
        name="CameraCapture"
        component={CameraCaptureScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen name="PhotoReview" component={PhotoReviewScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;

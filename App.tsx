import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PermissionScreen from './src/screens/PermissionScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddGroupNameScreen } from './src/screens/AddGroupNameScreen';
import { AddGroupInviteScreen } from './src/screens/AddGroupInviteScreen';
import { WaitingForMembersScreen } from './src/screens/WaitingForMembersScreen';
import type { GroupType } from './src/types/group';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { InviteCodeScreen } from './src/screens/InviteCodeScreen';
import { CameraCaptureScreen } from './src/screens/CameraCaptureScreen';
import { PhotoReviewScreen } from './src/screens/PhotoReviewScreen';
import { WakeNotificationScreen } from './src/screens/WakeNotificationScreen';
import { PhotoAnalysisScreen } from './src/screens/PhotoAnalysisScreen';
import { PhotoAnalysisSuccessScreen } from './src/screens/PhotoAnalysisSuccessScreen';
import { PhotoAnalysisFailureScreen } from './src/screens/PhotoAnalysisFailureScreen';
import { RewardListScreen } from './src/screens/RewardListScreen';
import { SelfWakeVerificationScreen } from './src/screens/SelfWakeVerificationScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Permission: undefined;
  Home: undefined;
  Settings: undefined;
  InviteCode: undefined;
  CameraCapture: {
    recipientName: string;
    photographer: 'jiwoo' | 'minju';
    attempt?: number;
  };
  PhotoReview: {
    photoPath: string;
    recipientName: string;
    photographer: 'jiwoo' | 'minju';
    attempt?: number;
  };
  WakeNotification: undefined;
  PhotoAnalysis: {
    photoPath: string;
    recipientName: string;
    photographer: 'jiwoo' | 'minju';
    attempt?: number;
  };
  PhotoAnalysisSuccess: {
    photoPath: string;
    recipientName: string;
    photographer: 'jiwoo' | 'minju';
    attempt?: number;
  };
  PhotoAnalysisFailure: {
    recipientName: string;
    photographer: 'jiwoo' | 'minju';
    attempt: number;
  };
  RewardList: undefined;
  SelfWakeVerification: {
    recipientName: string;
    photographer: 'jiwoo' | 'minju';
  };
  AddGroupName: { groupType: GroupType } | undefined;
  AddGroupInvite: { groupType: GroupType; groupName: string } | undefined;
  WaitingForMembers:
    | {
        groupType: GroupType;
        groupName: string;
        viewer?: 'jiwoo' | 'minju';
      }
    | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Permission" component={PermissionScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="InviteCode" component={InviteCodeScreen} />
          <Stack.Screen name="CameraCapture" component={CameraCaptureScreen} />
          <Stack.Screen name="PhotoReview" component={PhotoReviewScreen} />
          <Stack.Screen
            name="WakeNotification"
            component={WakeNotificationScreen}
          />
          <Stack.Screen name="PhotoAnalysis" component={PhotoAnalysisScreen} />
          <Stack.Screen
            name="PhotoAnalysisSuccess"
            component={PhotoAnalysisSuccessScreen}
          />
          <Stack.Screen
            name="PhotoAnalysisFailure"
            component={PhotoAnalysisFailureScreen}
          />
          <Stack.Screen name="RewardList" component={RewardListScreen} />
          <Stack.Screen
            name="SelfWakeVerification"
            component={SelfWakeVerificationScreen}
          />
          <Stack.Screen name="AddGroupName" component={AddGroupNameScreen} />
          <Stack.Screen
            name="AddGroupInvite"
            component={AddGroupInviteScreen}
          />
          <Stack.Screen
            name="WaitingForMembers"
            component={WaitingForMembersScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

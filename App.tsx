import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddGroupScreen } from './src/screens/AddGroupScreen';
import { AddGroupNameScreen } from './src/screens/AddGroupNameScreen';
import { AddGroupInviteScreen } from './src/screens/AddGroupInviteScreen';
import { GroupScreen } from './src/screens/GroupScreen';
import { WakeUpScreen } from './src/screens/WakeUpScreen';
import { AlreadyWokenScreen } from './src/screens/AlreadyWokenScreen';
import { WaitingForMembersScreen } from './src/screens/WaitingForMembersScreen';
import type { GroupType } from './src/types/group';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { RoommateGroupScreen } from './src/screens/RoommateGroupScreen';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  RoommateGroup: undefined;
  AddGroup: undefined;
  AddGroupName: { groupType: GroupType } | undefined;
  AddGroupInvite:
    | { groupType: GroupType; groupName: string }
    | undefined;
  Group: undefined;
  WakeUp: { wakerName: string };
  AlreadyWoken: { wakerName: string };
  WaitingForMembers:
    | { groupType: GroupType; groupName: string }
    | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="RoommateGroup" component={RoommateGroupScreen} />
          <Stack.Screen name="AddGroup" component={AddGroupScreen} />
          <Stack.Screen name="AddGroupName" component={AddGroupNameScreen} />
          <Stack.Screen
            name="AddGroupInvite"
            component={AddGroupInviteScreen}
          />
          <Stack.Screen name="Group" component={GroupScreen} />
          <Stack.Screen name="WakeUp" component={WakeUpScreen} />
          <Stack.Screen name="AlreadyWoken" component={AlreadyWokenScreen} />
          <Stack.Screen
            name="WaitingForMembers"
            component={WaitingForMembersScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

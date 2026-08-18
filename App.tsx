import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GroupsProvider } from './src/context/GroupsContext';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <GroupsProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </GroupsProvider>
  );
};

export default App;

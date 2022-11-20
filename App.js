import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Stacks from './navigation/stacks';
import Tabs from './navigation/tabs';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: Async Storage has been extracted from react-native core']);
const App = () => {
  return(
    <NavigationContainer>
      <Stacks/>
    </NavigationContainer>
  );
}

export default App;
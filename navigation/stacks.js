import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Tabs from './tabs';
import LoginScreen from '../screens/LoginScreen'
import SignupScreen from '../screens/SignupScreen'
import UserDetailsScreen from '../screens/UserDetailsScreen'

const Stack = createNativeStackNavigator();

const Stacks = () => {
    return(
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false,}}>
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Login" component={LoginScreen} /> 
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
            
        </Stack.Navigator>
    )

    
}

export default Stacks;
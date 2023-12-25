import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import {useSelector} from 'react-redux';
import DrawerNavigation from './DrawerNavigation';
import {NavigationContainer} from '@react-navigation/native';
const Stack = createStackNavigator();

const StackNavigation = props => {
  const user = useSelector(state => state?.user?.currentuser);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'Drawer' : 'Login'}
        screenOptions={{headerShown: false, statusBarHidden: true}}>
        <Stack.Screen
          options={{gestureEnabled: false}}
          name="Login"
          component={Login}
        />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Drawer" component={DrawerNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;

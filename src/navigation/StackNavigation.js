import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import {useSelector} from 'react-redux';
import DrawerNavigation from './DrawerNavigation';
import {NavigationContainer} from '@react-navigation/native';
const stack = createStackNavigator();

const StackNavigation = props => {
  const user = useSelector(state => state?.user?.currentuser);

  return (
    <NavigationContainer>
      <stack.Navigator
        initialRouteName={user ? 'Drawer' : 'Login'}
        screenOptions={{headerShown: false}}>
        <stack.Screen
          options={{gestureEnabled: false}}
          name="Login"
          component={Login}
        />
        <stack.Screen name="Register" component={Register} />
        <stack.Screen name="Drawer" component={DrawerNavigation} />
      </stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;

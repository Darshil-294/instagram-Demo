import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomNavigation from './BottomNavigation';
import DrawerScreen from './DrawerScreen';
import {Images} from '../helper/images';
import {wp} from '../helper/global';
import {useSelector} from 'react-redux';

const DrawerNavigation = ({}) => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      screenOptions={({navigation}) => ({
        drawerType: 'front',
        title: 'Instagram',
        headerShown: false,
      })}
      drawerContent={props => <DrawerScreen {...props} />}>
      <Drawer.Screen name="Bottom" component={BottomNavigation} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({
  menu: {
    width: wp(25),
    height: wp(25),
  },
});

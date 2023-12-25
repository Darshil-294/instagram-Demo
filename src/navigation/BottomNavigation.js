import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Feed from '../screens/Feed';
import Profile from '../screens/Profile';
import {Images} from '../helper/images';
import {wp} from '../helper/global';
import {useDispatch, useSelector} from 'react-redux';
import Save from '../screens/Save';
import {Route_name} from '../redux/Actions/Actions';

export const BottomNavigation = () => {
  const Tab = createBottomTabNavigator();
  const userdata = useSelector(state => state?.user?.currentuser);
  const DISPATCH = useDispatch();

  const routs = [];

  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => (
        // DISPATCH(Route_name([])),
        routs.push(navigation?.isFocused()),
        DISPATCH(Route_name(routs)),
        {
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({focused, color}) => {
            let iconName;
            let profile;
            if (route?.name === 'Home') {
              iconName = !focused ? Images?.home : Images?.homefill;
            } else if (route?.name === 'Save') {
              iconName = !focused ? Images?.save : Images?.savefill;
            } else if (route?.name === 'Feed') {
              iconName = !focused ? Images?.feed : Images?.feedfill;
            } else if (route?.name === 'Profile') {
              profile = userdata?.profile_picture;
            }
            return (
              <Image
                source={iconName || {uri: profile}}
                style={route?.name === 'Profile' ? styles.profile : styles.icon}
              />
            );
          },
        }
      )}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Save" component={Save} />
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  icon: {
    width: wp(25),
    height: wp(25),
  },
  profile: {
    width: wp(30),
    height: wp(30),
    borderRadius: 50,
  },
});

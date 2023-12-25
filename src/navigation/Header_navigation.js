import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {fs, hp, wp} from '../helper/global';
import {useNavigation} from '@react-navigation/native';
import {Images} from '../helper/images';

const Header_navigation = ({title}) => {
  const navigation = useNavigation();
  return (
    <View style={styles?.header_container}>
      <TouchableOpacity
        style={styles?.drawer}
        onPress={() => navigation?.openDrawer()}>
        <Image source={Images?.menu} style={styles?.drawer_image} />
      </TouchableOpacity>
      <Text style={styles?.title}>{title}</Text>
      <View style={styles?.last_container}></View>
    </View>
  );
};

export default Header_navigation;

const styles = StyleSheet.create({
  header_container: {
    paddingVertical: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    color: 'black',
    fontFamily: 'Outfit-Medium',
    fontSize: fs(20),
    // width: '20%',
  },
  drawer_image: {
    width: wp(25),
    height: hp(25),
  },

  last_container: {
    width: '20%',
    alignItems: 'flex-end',
  },
  drawer: {width: '20%'},
});

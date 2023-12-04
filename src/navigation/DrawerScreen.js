import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {fs, hp, wp} from '../helper/global';
import {Images} from '../helper/images';
import {useSelector} from 'react-redux';
import {colors} from '../helper/colors';

const DrawerScreen = ({navigation}) => {
  const [select, setselect] = useState('Home');
  const userdata = useSelector(state => state?.user?.currentuser);
  // console.log(props.navigation);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profile_container}>
        <Image
          style={styles.profile_picture}
          source={{uri: userdata?.profile_picture}}
        />
        <Text style={styles.title}>
          {userdata?.firstname} {userdata?.lastname}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setselect('Home');
          navigation.navigate('Home');
        }}
        style={select == 'Home' ? [styles.btn, styles.select_btn] : styles.btn}>
        <Image
          style={
            select == 'Home' ? [styles.icon, styles.icon_select] : [styles.icon]
          }
          source={select == 'Home' ? Images?.homefill : Images?.home}
        />
        <Text
          style={
            select == 'Home'
              ? [styles.unselect, styles.select]
              : styles.unselect
          }>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setselect('Save'), navigation.navigate('Save');
        }}
        style={select == 'Save' ? [styles.btn, styles.select_btn] : styles.btn}>
        <Image
          style={
            select == 'Save' ? [styles.icon, styles.icon_select] : [styles.icon]
          }
          source={select == 'Save' ? Images?.savefill : Images?.save}
        />
        <Text
          style={
            select == 'Save'
              ? [styles.unselect, styles.select]
              : styles.unselect
          }>
          Save
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setselect('Feed'), navigation.navigate('Feed');
        }}
        style={select == 'Feed' ? [styles.btn, styles.select_btn] : styles.btn}>
        <Image
          style={
            select == 'Feed' ? [styles.icon, styles.icon_select] : [styles.icon]
          }
          source={select == 'Feed' ? Images?.feedfill : Images?.feed}
        />
        <Text
          style={
            select == 'Feed'
              ? [styles.unselect, styles.select]
              : styles.unselect
          }>
          Feed
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setselect('Profile');
          navigation.navigate('Profile');
        }}
        style={
          select == 'Profile' ? [styles.btn, styles.select_btn] : styles.btn
        }>
        <Image
          style={styles.profile}
          source={{uri: userdata?.profile_picture}}
        />
        <Text
          style={
            select == 'Profile'
              ? [styles.unselect, styles.select]
              : styles.unselect
          }>
          Profile
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DrawerScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(20),
  },
  select_btn: {
    gap: wp(10),
    backgroundColor: 'black',
  },
  icon: {
    width: wp(22),
    height: wp(22),
  },
  btn: {
    paddingHorizontal: wp(10),
    paddingVertical: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(10),
    borderRadius: 10,
    marginBottom: hp(10),
  },
  icon_select: {
    tintColor: colors.white,
  },
  select: {
    color: colors.white,
  },
  unselect: {
    fontSize: fs(20),
    fontFamily: 'Outfit-Medium',
    color: colors.black,
  },
  profile: {
    width: wp(25),
    height: wp(25),
    borderRadius: 50,
  },
  profile_container: {
    marginTop: hp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile_picture: {
    width: wp(100),
    height: wp(100),
    borderRadius: 100,
  },
  title: {
    fontSize: fs(20),
    fontFamily: 'Outfit-Regular',
    marginVertical: hp(10),
  },
});
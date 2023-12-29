import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fs, hp, wp} from '../helper/global';
import {Images} from '../helper/images';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../helper/colors';
import Btn from '../components/common/Btn';
import auth from '@react-native-firebase/auth';
import {Current_User_Action} from '../redux/Actions/Actions';
import {StackActions, useRoute} from '@react-navigation/native';

const DrawerScreen = ({navigation}) => {
  const [select, setselect] = useState('Home');
  const userdata = useSelector(state => state?.user?.currentuser);
  const DISPATCH = useDispatch();
  const routs = useSelector(state => state?.user?.route_name);

  let route = [
    {
      route_name: 'Home',
      icon: Images?.home,
      icon_fill: Images?.homefill,
    },
    {
      route_name: 'Save',
      icon: Images?.save,
      icon_fill: Images?.savefill,
    },
    {
      route_name: 'Feed',
      icon: Images?.feed,
      icon_fill: Images?.feedfill,
    },
    {
      route_name: 'Profile',
      icon: userdata?.profile_picture,
      icon_fill: userdata?.profile_picture,
    },
  ];

  const Sign_Out = async () => {
    await auth()
      .signOut()
      .then(async () => {
        DISPATCH(Current_User_Action(null));
        navigation?.navigate('Login');
        console.log('User signed out!');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <View style={styles.profile_container}>
          <Image
            style={styles.profile_picture}
            source={{uri: userdata?.profile_picture}}
          />
          <Text style={styles.title}>
            {userdata?.firstname} {userdata?.lastname}
          </Text>
        </View>
        <FlatList
          data={route}
          renderItem={({item, index}) => {
            routs?.map((items, indexs) =>
              items == true && indexs == index
                ? setselect(item?.route_name)
                : '',
            );
            return (
              <TouchableOpacity
                onPress={() => {
                  setselect(item?.route_name);
                  navigation.navigate(item?.route_name);
                }}
                style={
                  select == item?.route_name
                    ? [styles.btn, styles.select_btn]
                    : styles.btn
                }>
                <Image
                  style={
                    item?.route_name == 'Profile'
                      ? styles.profile
                      : select == item?.route_name
                      ? [styles.icon, styles.icon_select]
                      : [styles.icon]
                  }
                  source={
                    item?.route_name == 'Profile'
                      ? select == item?.route_name
                        ? {uri: userdata?.profile_picture}
                        : {uri: userdata?.profile_picture}
                      : select == item?.route_name
                      ? item?.icon_fill
                      : item?.icon
                  }
                />
                <Text
                  style={
                    select == item?.route_name
                      ? [styles.unselect, styles.select]
                      : styles.unselect
                  }>
                  {item?.route_name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <Btn
        title="Sign Out"
        onpress={Sign_Out}
        title_style={styles?.signout_title}
        style={styles?.signout_btn}
      />
    </SafeAreaView>
  );
};

export default DrawerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: colors?.black,
  },
  signout_title: {
    fontFamily: 'Outfit-Regular',
  },
  signout_btn: {
    marginBottom: hp(20),
  },
});

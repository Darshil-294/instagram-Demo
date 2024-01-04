import {
  Image,
  LogBox,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fs, hp, wp} from '../helper/global';
import {useNavigation} from '@react-navigation/native';
import {Images} from '../helper/images';
import Add_friend from '../screens/Add_friend';
import Request from '../screens/Request';

const Header_navigation = ({title}) => {
  const [visible, setvisible] = useState(false);
  const [notification_visible, setnotification_visible] = useState(false);
  const [notification, setnotification] = useState(false);
  // const [titles, settitle] = useState(title);
  const navigation = useNavigation();

  // useEffect(() => {
  //   settitle(title);
  // }, []);
  return (
    <View style={styles?.header_container}>
      <TouchableOpacity
        style={styles?.drawer}
        onPress={() => navigation?.openDrawer()}>
        <Image source={Images?.menu} style={styles?.drawer_image} />
      </TouchableOpacity>
      <Text style={styles?.title}>{title}</Text>
      <View style={styles?.last_container}>
        <TouchableOpacity onPress={() => setvisible(true)}>
          <Image source={Images?.adduser} style={styles?.add_user} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setnotification_visible(true)}>
          <Image
            source={notification ? Images?.bell_info : Images?.bell}
            style={styles?.bell}
          />
        </TouchableOpacity>
        <Add_friend visible={visible} close={setvisible} />
        <Request
          visible={notification_visible}
          close={setnotification_visible}
          notification={setnotification}
        />
      </View>
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
    alignItems: 'center',
    paddingRight: wp(10),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: wp(10),
    // backgroundColor: 'yellow',
  },
  drawer: {width: '20%'},
  add_user: {
    width: wp(20),
    height: wp(20),
  },
  bell: {
    width: wp(25),
    height: wp(25),
  },
});

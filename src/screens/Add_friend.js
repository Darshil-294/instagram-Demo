import {
  FlatList,
  Image,
  LogBox,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modals from '../components/common/Modals';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {fs, hp, wp} from '../helper/global';
import {colors} from '../helper/colors';

const Add_friend = ({visible, close}) => {
  const [data, setdata] = useState([]);
  const [users, setusers] = useState([]);

  useEffect(() => {
    get_user();
  }, []);

  const get_user = async () => {
    let datas = [];
    try {
      firestore()
        ?.collection('users')
        ?.onSnapshot(res => {
          datas = [];
          res?.docs?.map(item => {
            item?.data()?.uid !== auth()?.currentUser?.uid
              ? datas.push(item?.data())
              : null;
          });
          setdata(datas);
        });
    } catch (error) {}
  };
  const send_requst = async datas => {
    firestore()
      ?.collection('users')
      ?.doc(datas)
      ?.update({
        request: firebase?.firestore?.FieldValue?.arrayUnion(
          auth()?.currentUser?.uid,
        ),
      })
      .catch(error => console.log('Error', error));
  };

  const cancel_requst = async datas => {
    await firestore()
      ?.collection('users')
      ?.doc(datas)
      ?.update({
        request: firebase?.firestore?.FieldValue?.arrayRemove(
          auth()?.currentUser?.uid,
        ),
      })
      // .then(() => {
      //   setrender(!render);
      // })
      .catch(error => console.log('Error', error));
  };

  const unfollow = async val => {
    await firestore()
      ?.collection('users')
      ?.doc(auth()?.currentUser?.uid)
      ?.update({following: firebase?.firestore?.FieldValue?.arrayRemove(val)})
      ?.then(async () => {
        firestore()
          ?.collection('users')
          ?.doc(val)
          ?.update({
            followers: firebase?.firestore?.FieldValue?.arrayRemove(
              auth()?.currentUser?.uid,
            ),
          });
      });
  };

  return (
    <View>
      <Modals
        animation="none"
        visible={visible}
        close={close}
        containStyle={styles?.modal_contain}
        containerStyle={styles?.modal}
        title="Suggestions"
        contain={
          <FlatList
            data={data}
            // extraData={render}
            renderItem={({item, index}) => {
              return (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles?.list}>
                    <View style={styles?.info}>
                      <Image
                        source={{uri: item?.profile_picture}}
                        style={styles?.profile_picture}
                      />
                      <View style={styles?.name}>
                        <Text style={styles?.title}>{item?.full_name}</Text>
                        <Text style={styles?.description}>
                          Suggestion to follow {item?.firstname}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={
                        item.request.some(e => e == auth()?.currentUser?.uid)
                          ? styles?.requested_btn
                          : styles?.btn
                      }
                      onPress={() => {
                        item.request.some(e => e == auth()?.currentUser?.uid)
                          ? cancel_requst(item?.uid)
                          : // : console.log(item?.uid);
                          item?.followers.includes(auth()?.currentUser?.uid)
                          ? unfollow(item?.uid)
                          : send_requst(item?.uid);
                      }}>
                      <Text
                        style={
                          item.request.some(e => e == auth()?.currentUser?.uid)
                            ? styles?.requested_btn_title
                            : styles?.btn_title
                        }>
                        {item.request.some(e => e == auth()?.currentUser?.uid)
                          ? 'Requested'
                          : item?.followers?.every(e => e == item?.uid)
                          ? 'Follow'
                          : 'Following'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              );
            }}
          />
        }
      />
    </View>
  );
};

export default Add_friend;

const styles = StyleSheet.create({
  modal_contain: {
    width: '100%',
    justifyContent: 'flex-end',
    borderBottomRightRadius: 0,
    borderBottomStartRadius: 0,
  },
  modal: {
    justifyContent: 'flex-end',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: hp(10),
    // backgroundColor: 'yellow',
    maxHeight: hp(450),
  },
  profile_picture: {
    width: wp(50),
    height: wp(50),
    borderRadius: 50,
  },
  title: {
    color: colors?.black,
    fontSize: fs(16),
    fontFamily: 'Outfit-Medium',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    paddingLeft: wp(10),
    flexWrap: 'wrap',
  },
  description: {
    color: colors?.black,
    fontFamily: 'Outfit-Medium',
  },
  btn: {
    backgroundColor: colors?.light_blue,
    paddingVertical: Platform.OS === 'ios' ? hp(6) : hp(5),
    paddingHorizontal: Platform.OS === 'ios' ? wp(10) : wp(12),
    borderRadius: 5,
  },
  requested_btn: {
    backgroundColor: colors?.light_gray,
    paddingVertical: Platform.OS === 'ios' ? hp(6) : hp(5),
    paddingHorizontal: Platform.OS === 'ios' ? wp(10) : wp(12),
    borderRadius: 5,
  },
  btn_title: {
    color: colors?.white,
    fontSize: fs(16),
    width: wp(70),
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  requested_btn_title: {
    color: colors?.grey,
    fontSize: fs(15),
    width: wp(70),
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
});

import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modals from '../components/common/Modals';
import {strings} from '../helper/string';
import {colors} from '../helper/colors';
import {fs, hp, wp} from '../helper/global';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {FlatList, ScrollView} from 'react-native-gesture-handler';

const Request = ({visible, close, notification}) => {
  const [data, setdata] = useState([]);
  data?.length > 0 ? notification(true) : notification(false);

  useEffect(() => {
    get_data();
  }, []);

  const get_data = async () => {
    let user_data = [];
    // setdata([]);
    firestore()
      ?.collection('users')
      ?.doc(auth()?.currentUser?.uid)
      ?.onSnapshot(async res => {
        user_data = [];
        if (res?.data()?.request.length == 0) {
          setdata([]);
        }
        await res?.data()?.request?.map(async item => {
          await firestore()
            ?.collection('users')
            ?.doc(item)
            ?.get()
            ?.then(res => {
              user_data.push(res?.data());
              setdata(user_data);
            });
        });
      });
  };

  const delete_request = async value => {
    await firestore()
      ?.collection('users')
      ?.doc(auth()?.currentUser?.uid)
      ?.update({
        request: firebase?.firestore?.FieldValue?.arrayRemove(value),
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
        title="Request"
        contain={
          <>
            {data?.length == 0 ? (
              <Text style={styles?.warnning}>{strings?.NO_Requests}</Text>
            ) : (
              <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
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
                            <Text style={styles?.title}>{item?.firstname}</Text>
                            <Text style={styles?.description}>
                              Request From{' '}
                              {item?.firstname.length > 3
                                ? item?.firstname.substring(0, 3)
                                : item?.firstname}
                              ...
                            </Text>
                          </View>
                        </View>
                        <View style={styles?.btn_container}>
                          <TouchableOpacity
                            style={styles?.btn}
                            onPress={() => {}}>
                            <Text style={styles?.btn_title}>{'Confirm'}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles?.delete_btn}
                            onPress={() => delete_request(item?.uid)}>
                            <Text style={styles?.delete_btn_title}>
                              {'Delete'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </ScrollView>
                  );
                }}
              />
            )}
          </>
        }
      />
    </View>
  );
};

export default Request;

const styles = StyleSheet.create({
  modal_contain: {
    width: '100%',
    justifyContent: 'flex-end',
    borderBottomRightRadius: 0,
    borderBottomStartRadius: 0,
    // alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
  },
  warnning: {
    color: colors?.black,
    fontSize: fs(16),
    paddingVertical: hp(100),
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: hp(10),
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
    // backgroundColor: 'yellow',
  },
  name: {
    paddingLeft: wp(10),
    flexWrap: 'wrap',
  },
  description: {
    color: colors?.black,
    fontFamily: 'Outfit-Medium',
    fontSize: fs(15),
  },
  btn: {
    backgroundColor: colors?.light_blue,
    width: wp(70),
    height: hp(30),
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delete_btn: {
    backgroundColor: colors?.light_gray,
    width: wp(70),
    height: hp(30),
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_title: {
    color: colors?.white,
    fontSize: fs(16),
  },
  delete_btn_title: {
    color: colors?.black,
    fontSize: fs(15),
  },
  btn_container: {
    flexDirection: 'row',
    gap: wp(5),
  },
});

import {
  Dimensions,
  FlatList,
  Image,
  LogBox,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Modals from '../components/common/Modals';
import {fs, hp, wp} from '../helper/global';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../helper/colors';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {Images} from '../helper/images';
import {strings} from '../helper/string';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Header_navigation from '../navigation/Header_navigation';
import {
  like_handler,
  save_post_handler,
  un_like_handler,
  un_save_post_handler,
} from '../helper/Functions';
import {Save_Post} from '../redux/Actions/Actions';
import {useIsFocused} from '@react-navigation/native';

const Save = () => {
  const [data, setdata] = useState([]);
  const [userdata, setUserdata] = useState([]);
  const [visible, setvisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(1);
  const [getData, setgetData] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      user_data();
    }
  }, [getData, isFocused]);

  const current_index = useRef(null);
  const user = useSelector(state => state?.user?.currentuser);

  // const get_User_Data = async () => {
  //   const datas = [];
  //   try {
  //     setvisible(true);
  //     setRefreshing(true);
  //     firestore()
  //       ?.collection('users')
  //       ?.doc(auth()?.currentUser?.uid)
  //       ?.onSnapshot(async querySnapshot => {
  //         let result = await querySnapshot
  //           ?.data()
  //           ?.savedPost?.map(async response => {
  //             let ress = await firestore()
  //               ?.collection('post')
  //               ?.doc(response?.uid)
  //               ?.get()
  //               ?.then(async res => {
  //                 return await res
  //                   ?.data()
  //                   ?.postList?.filter(item => item?.id == response?.id);
  //               });
  //             return ress;
  //           });
  //         await Promise.all(result).then(res => {
  //           setdata(res?.flat());
  //         });
  //       });
  //     setvisible(false);
  //     setRefreshing(false);
  //   } catch (error) {
  //     setvisible(false);
  //     setRefreshing(false);
  //     console.log('Error', error);
  //   }
  // };

  const get_User_Data = async () => {
    try {
      setvisible(true);
      setRefreshing(true);
      firestore()
        ?.collection('users')
        ?.doc(auth()?.currentUser?.uid)
        ?.onSnapshot(async querySnapshot => {
          let result = await querySnapshot
            ?.data()
            ?.savedPost?.map(async response => {
              let ress = await firestore()
                ?.collection('post')
                ?.doc(response?.uid)
                ?.get()
                ?.then(async res => {
                  return await res
                    ?.data()
                    ?.postList?.filter(item => item?.id == response?.id);
                });
              return ress;
            });
          await Promise.all(result).then(res => {
            setdata(res?.flat());
          });
        });
      setvisible(false);
      setRefreshing(false);
    } catch (error) {
      setvisible(false);
      setRefreshing(false);
      console.log('Error', error);
    }
  };

  const user_data = async () => {
    firestore()
      ?.collection('users')
      ?.onSnapshot(res => {
        res?.docs?.map(doc => {
          if (doc?.id == auth()?.currentUser?.uid) {
            setUserdata(doc?.data());
          }
        });
      });
    get_User_Data();
  };

  const save_post_handler = async value => {
    await firestore()
      ?.collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        savedPost: firebase.firestore.FieldValue.arrayUnion({
          id: value?.id,
          uid: value?.uid,
        }),
      });
  };

  const un_save_post_handler = async value => {
    await firestore()
      ?.collection('users')
      .doc(auth()?.currentUser?.uid)
      .update({
        savedPost: firebase.firestore.FieldValue.arrayRemove({
          id: value?.id,
          uid: value?.uid,
        }),
      });
  };

  const like_handler = async value => {
    try {
      await firestore()
        ?.collection('post')
        .doc(value?.uid)
        .get()
        .then(async d => {
          await firestore()
            ?.collection('post')
            .doc(value?.uid)
            .update({
              postList: d.data().postList.map(i => {
                if (i.id == value.id) {
                  i.user_likes = [...i.user_likes, auth().currentUser.uid];
                  return i;
                }
                return i;
              }),
            });
        });
      setgetData(!getData);
    } catch (error) {
      console.log('error', error);
    }
  };

  const un_like_handler = async value => {
    await firestore()
      ?.collection('post')
      .doc(value?.uid)
      .get()
      .then(async d => {
        await firestore()
          ?.collection('post')
          .doc(value?.uid)
          .update({
            postList: d.data().postList.map(i => {
              if (i.id == value.id) {
                i.user_likes = i.user_likes.filter(
                  a => a !== auth().currentUser.uid,
                );
                return i;
              }
              return i;
            }),
          })
          .catch(err => {
            console.log(err);
          });
        setgetData(!getData);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header_navigation title={'Save'} />
      {data.length == 0 ? (
        <View style={styles?.warning_container}>
          <Text>{strings?.NO_save}</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item?.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={get_User_Data} />
          }
          renderItem={({item, index}) => {
            return (
              <View style={styles?.card_container}>
                <View style={styles?.card_header}>
                  <View style={styles?.header_contain}>
                    <Image
                      source={{uri: item?.profile_picture}}
                      style={styles?.profile_img}
                    />
                    <View>
                      <Text style={styles?.account_name}>{item?.fullName}</Text>
                      <Text style={styles?.title}>{item?.title}</Text>
                    </View>
                  </View>
                  <View style={styles?.counter}>
                    <Text style={styles?.counter_lable}>
                      {item?.images?.length > 1 ? (
                        <Text>
                          {currentIndex}/{item?.images?.length}
                        </Text>
                      ) : null}
                    </Text>
                  </View>
                </View>
                <SwiperFlatList
                  style={{width}}
                  ref={current_index}
                  index={0}
                  keyExtractor={item => item?.id}
                  onChangeIndex={() =>
                    setcurrentIndex(
                      current_index?.current?.getCurrentIndex() + 1,
                    )
                  }
                  bounces={false}
                  data={item?.images}
                  renderItem={({item, index}) => (
                    <>
                      <Image
                        source={{uri: item?.path}}
                        style={styles?.profile_picture}
                      />
                    </>
                  )}
                />
                <View style={styles?.footer_container}>
                  <View style={styles?.like_container}>
                    <TouchableOpacity
                      onPress={async () => {
                        item?.user_likes?.some(
                          val => val === auth()?.currentUser?.uid,
                        )
                          ? un_like_handler(item)
                          : like_handler(item);
                      }}>
                      <Image
                        source={
                          item?.user_likes?.some(
                            val => val == auth()?.currentUser?.uid,
                          )
                            ? Images?.likefill
                            : Images?.like
                        }
                        style={styles?.like}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Image source={Images?.comment} style={styles?.like} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={async () => {
                        userdata.savedPost.some(i => i?.id == item.id)
                          ? un_save_post_handler(item)
                          : save_post_handler(item);
                      }}>
                      <Image
                        source={
                          userdata.savedPost.some(i => i?.id == item.id)
                            ? Images.savefill
                            : Images.save
                        }
                        style={styles?.like}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles?.discription_container}>
                  <Text style={styles?.username}>{item?.fullName}</Text>
                  <Text style={styles?.description}>{item?.description}</Text>
                </View>
                <View style={styles?.like_section}>
                  {item?.user_likes?.length == 0 ? null : (
                    <View style={styles?.like_header}>
                      <Text style={styles?.like_title}>{strings?.like} by</Text>
                      <Text style={{color: Colors?.black}}>
                        {item?.user_likes?.length}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
      <Modals visible={visible} />
    </SafeAreaView>
  );
};

export default Save;

const {width, height, scale} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card_container: {
    width: width,
    marginBottom: hp(10),
    overflow: 'hidden',
  },
  profile_img: {
    width: wp(40),
    height: wp(40),
    borderRadius: 100,
  },
  card_header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(8),
    paddingHorizontal: wp(10),
    justifyContent: 'space-between',
  },
  account_name: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: colors?.black,
  },
  title: {
    fontFamily: 'Outfit-Medium',
    color: colors?.black,
  },
  profile_picture: {width: width, height: hp(350)},
  counter_lable: {
    alignSelf: 'center',
    color: colors?.black,
  },
  footer_container: {
    paddingVertical: hp(12),
    paddingHorizontal: wp(15),
    // backgroundColor: 'yellow',
    flexDirection: 'row',
  },
  like: {
    width: wp(25),
    height: wp(25),
  },
  header_contain: {
    flexDirection: 'row',
    gap: wp(10),
  },
  like_container: {
    flexDirection: 'row',
    gap: wp(15),
    alignItems: 'center',
  },
  discription_container: {
    paddingHorizontal: wp(10),
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: wp(10),
    flexWrap: 'wrap',
  },
  username: {
    color: colors?.black,
    fontFamily: 'Outfit-Medium',
    fontSize: fs(15),
  },
  like_section: {
    paddingHorizontal: wp(10),
  },
  like_title: {
    color: colors?.black,
    fontFamily: 'Outfit-Medium',
    fontSize: fs(15),
  },
  like_header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: wp(5),
    flexWrap: 'wrap',
  },
  description: {
    color: colors?.black,
  },
  warning_container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

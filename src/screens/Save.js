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
import {useSelector} from 'react-redux';
import {colors} from '../helper/colors';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {Images} from '../helper/images';
import {strings} from '../helper/string';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Header_navigation from '../navigation/Header_navigation';

const Save = () => {
  const [data, setdata] = useState([]);
  const [userdata, setUserdata] = useState({});
  const [visible, setvisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(1);
  const [users, setusers] = useState([]);

  useEffect(() => {
    get_User_Data();
    // get_Data();
  }, []);

  const current_index = useRef(null);

  const user = useSelector(state => state?.user?.currentuser);

  const get_User_Data = async () => {
    try {
      setvisible(true);
      setRefreshing(true);
      firestore()
        ?.collection('users')
        ?.onSnapshot(async querySnapshot => {
          querySnapshot?.docs.length == 0
            ? (setvisible(false), setRefreshing(false))
            : querySnapshot?.forEach(documentSnapshot => {
                if (documentSnapshot?.id == auth()?.currentUser?.uid) {
                  firestore()
                    .collection('post')
                    .onSnapshot(onSnapshotData => {
                      let array = [];
                      onSnapshotData.docs.forEach(i => {
                        array.push(i.data().postList);
                      });
                      setvisible(false);
                      setRefreshing(false);
                      setdata(
                        array
                          .flat()
                          .filter(e =>
                            documentSnapshot
                              ?.data()
                              ?.savedPost?.some(w => w === e.id),
                          ),
                      );
                      setvisible(false), setRefreshing(false);
                    });
                  setUserdata(documentSnapshot?.data());
                  setvisible(false);
                  setRefreshing(false);
                }
              });
        });
    } catch (error) {
      setvisible(false);
      setRefreshing(false);
      console.log('Error', error);
    }
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
                if (i.id === value.id) {
                  i.user_likes = [...i.user_likes, auth().currentUser.uid];
                  return i;
                }
                return i;
              }),
            });
        });
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
          });
      });
  };

  const save_post_handler = async value => {
    await firestore()
      ?.collection('users')
      .doc(value?.uid)
      .update({
        savedPost: firebase.firestore.FieldValue.arrayUnion(value?.id),
      });
  };

  const un_save_post_handler = async value => {
    await firestore()
      ?.collection('users')
      .doc(value?.uid)
      .update({
        savedPost: firebase.firestore.FieldValue.arrayRemove(value?.id),
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
          keyExtractor={item => item.id}
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
                      <Text style={styles?.account_name}>
                        {user?.firstname} {user?.lastname}
                      </Text>
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
                        item?.user_likes?.some(val => val == item?.uid)
                          ? un_like_handler(item)
                          : like_handler(item);
                      }}>
                      <Image
                        source={
                          item?.user_likes?.some(val => val == item?.uid)
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
                        userdata.savedPost.some(i => i == item.id)
                          ? un_save_post_handler(item)
                          : save_post_handler(item);
                      }}>
                      <Image
                        source={
                          userdata.savedPost.some(i => i == item.id)
                            ? Images.savefill
                            : Images.save
                        }
                        style={styles?.like}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles?.discription_container}>
                  <Text style={styles?.username}>
                    {user?.firstname} {user?.lastname}
                  </Text>
                  <Text style={styles?.description}>{item?.description}</Text>
                </View>
                <View style={styles?.like_section}>
                  {item?.user_likes?.length == 0 ? null : (
                    <View style={styles?.like_header}>
                      <Text style={styles?.like_title}>{strings?.like} by</Text>
                      <Text style={{color: Colors?.black}}>
                        {users}
                        {item?.user_likes?.length == 1 ? null : (
                          <Text> {item?.user_likes?.length - 1} Other</Text>
                        )}
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
    gap: 10,
  },
  like_container: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  discription_container: {
    paddingHorizontal: wp(10),
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
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
    gap: 5,
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

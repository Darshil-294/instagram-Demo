import {
  Dimensions,
  FlatList,
  Image,
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

const Home = () => {
  const [data, setdata] = useState([]);
  const [visible, setvisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(1);
  const [users, setusers] = useState('');
  const [like, setlike] = useState('');

  // const userId = auth()?.currentUser?.uid;
  useEffect(() => {
    get_Data();
  }, []);

  // console.log(data[0]?.user_likes[0]);

  const current_index = useRef(null);

  const user = useSelector(state => state?.user?.currentuser);

  const get_Data = async () => {
    setvisible(true);
    setRefreshing(true);
    let temp = [];
    await Promise.all(
      firestore()
        ?.collection('post')
        ?.onSnapshot(async querySnapshot => {
          await Promise.all(
            querySnapshot?.forEach(documentSnapshot => {
              if (documentSnapshot?.id == auth()?.currentUser?.uid) {
                setdata(documentSnapshot?.data()?.postList);
                temp = [...documentSnapshot?.data()?.postList];
              }
            }),
            temp?.map(itemss => {
              if (itemss?.user_likes[0] != undefined) {
                firestore()
                  ?.collection('users')
                  ?.onSnapshot(item => {
                    item?.docs?.map(items => {
                      if (items?.data()?.uid == itemss?.user_likes[0]) {
                        setusers(items?.data()?.full_name);
                        console.log('users', users);
                      }
                    });
                  });
              } else {
                console.log('NO users');
              }
            }),
          );
        }),
    )
      .catch(err => {
        setvisible(false);
        console.log('err', err);
      })
      .finally(() => {
        setvisible(false);
        setRefreshing(false);
      });
  };

  // const get_Data = async () => {
  //   setvisible(true);
  //   setRefreshing(true);
  //   try {
  //     const querySnapshot = await firestore().collection('post').get();
  //     const postData = querySnapshot.docs
  //       .filter(
  //         documentSnapshot => documentSnapshot.id === auth()?.currentUser?.uid,
  //       )
  //       .map(documentSnapshot => documentSnapshot.data().postList);
  //     setdata(postData);

  //     postData.forEach((itemss, index) => {
  //       console.log('itemss[]', itemss[0]?.uid);
  //       if (itemss.user_likes[0] !== undefined) {
  //         firestore()
  //           .collection('users')
  //           .where(itemss[index]?.uid, '==', itemss.user_likes[0])
  //           .onSnapshot(item => {
  //             console.log('snap item', item);
  //             item.docs.forEach(items => {
  //               setusers(items.data().full_name);
  //               console.log('users', items.data().full_name);
  //             });
  //           });
  //       } else {
  //         console.log('noooo');
  //       }
  //     });

  //     setvisible(false);
  //     setRefreshing(false);
  //   } catch (err) {
  //     setvisible(false);
  //     console.log('err', err);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={get_Data} />
        }
        renderItem={({item, indexs}) => {
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
                        {currentIndex}/{item?.images.length}
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
                  setcurrentIndex(current_index.current?.getCurrentIndex() + 1)
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
                  <TouchableOpacity>
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
                  <TouchableOpacity>
                    <Image source={Images?.save} style={styles?.like} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles?.discription_container}>
                <Text style={styles?.username}>
                  {user?.firstname} {user?.lastname}
                </Text>
                <Text>{item?.description}</Text>
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

      <Modals visible={visible} />
    </SafeAreaView>
  );
};

export default Home;

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
  counter: {
    // flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.63)',
    // width: wp(45),
    // height: hp(30),
    // borderRadius: 50,
    // justifyContent: 'center',
  },
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
    alignItems: 'flex-end',
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
    alignItems: 'flex-end',
    gap: 5,
    flexWrap: 'wrap',
  },
});

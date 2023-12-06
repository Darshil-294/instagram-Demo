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

const Home = () => {
  const [data, setdata] = useState([]);
  const [visible, setvisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(1);

  // const userId = auth()?.currentUser?.uid;
  useEffect(() => {
    get_Data();

    return () => get_Data();
  }, []);

  const current_index = useRef(null);

  const user = useSelector(state => state?.user?.currentuser);

  const get_Data = async () => {
    setvisible(true);
    console.log('start');
    setRefreshing(true);
    let data;
    Promise.all(
      (data = firestore()
        ?.collection('post')
        ?.doc(auth()?.currentUser?.uid)
        ?.onSnapshot(async res => {
          setdata(await res?.data()?.postList);
        })),
    )
      .then(() => {
        console.log('end');
        setvisible(false);
        setRefreshing(false);
      })
      .catch(error => {
        setvisible(false);
        console.log('EROOR', error);
      });

    return data;
  };
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
                    {item?.images.length > 1 ? (
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
                    <Image source={Images?.like} style={styles?.like} />
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
    alignItems: 'baseline',
    gap: 10,
    flexWrap: 'wrap',
  },
  username: {
    color: colors?.black,
    fontFamily: 'Outfit-Medium',
    fontSize: fs(15),
  },
});

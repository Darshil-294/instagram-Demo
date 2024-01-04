import {
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Images} from '../helper/images';
import {fs, hp, wp} from '../helper/global';
import Modals from '../components/common/Modals';
import {colors} from '../helper/colors';
import firestore from '@react-native-firebase/firestore';
import auth, {
  getAuth,
  updateProfile,
  updateEmail,
  firebase,
} from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import Text_Input from '../components/common/Text_Input';
import {strings} from '../helper/string';
import Btn from '../components/common/Btn';
import {useDispatch} from 'react-redux';
import {Current_User_Action} from '../redux/Actions/Actions';
import {ValidationHandler} from '../helper/constants';
import Header_navigation from '../navigation/Header_navigation';

const Profile = ({navigation}) => {
  const [data, setdata] = useState([]);
  const [visible, setvisible] = useState(false);
  const [change_credentials_modal, setchange_credentials_modal] =
    useState(false);
  const [images, setimages] = useState([]);
  const [post, setpost] = useState([]);
  const [followers, setfollowers] = useState([]);
  const [following, setfollowing] = useState([]);
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [email, setemail] = useState('');
  const [phone, setphone] = useState(Number);
  const [password, setpassword] = useState('');
  const [credentials_verify, setcredentials_verify] = useState('');
  const [followers_modal, setfollowers_modal] = useState(false);
  const [following_modal, setfollowing_modal] = useState(false);

  useEffect(() => {
    user_data();
  }, []);

  useEffect(() => {
    user_post();
  }, []);

  const DISPATCH = useDispatch();

  const user_data = async () => {
    try {
      Promise.all(
        firestore()
          ?.collection('users')
          ?.doc(auth()?.currentUser?.uid)
          ?.onSnapshot(res => {
            setdata(res?.data());
          }),
      ).then(() => {
        setfirstname(data?.firstname);
        setlastname(data?.lastname);
        setphone(data?.phone);
        setemail(data?.email);
        setpassword(data?.password);
        setimages(data?.profile_picture);
      });
    } catch (error) {
      console.log('error user_data', error);
    }
  };

  const user_post = async () => {
    let datas = [];
    try {
      firestore()
        ?.collection('post')
        ?.doc(auth()?.currentUser?.uid)
        ?.onSnapshot(async res => {
          datas = [];
          await res?.data()?.postList?.map(item => {
            datas.push(...item?.images);
          });
          setpost(datas);
        });
    } catch (error) {
      console.log('Error', error);
    }
  };

  const save_data = async () => {
    let url;
    let user;
    let reference;
    let res;
    if (data?.email === email || data?.password === password) {
    }
    if (images === data?.profile_picture) {
      url = data?.profile_picture;
    } else {
      const filename = images?.substring(
        images?.lastIndexOf('/') + 1,
        images?.length,
      );
      await new Promise.all(
        (reference = firebase.storage()?.ref(filename)),
        (res = await reference.putFile(images)),
        (url = await firebase
          .storage()
          ?.ref(res.metadata.name)
          ?.getDownloadURL()),
      );
    }
    user = {
      uid: firebase?.auth().currentUser?.uid,
      firstname: firstname,
      lastname: lastname,
      email: email.toLocaleLowerCase(),
      password: password,
      profile_picture: url,
      full_name: firstname + ' ' + lastname,
      phone: phone,
    };
    await firestore()
      ?.collection('users')
      ?.doc(firebase?.auth().currentUser?.uid)
      ?.update(user)
      ?.then(() => {
        console.log('User add successfully!');
        DISPATCH(Current_User_Action(user));
        setvisible(false);
        navigation?.navigate('Login');
      })
      ?.catch(errr => {
        console.log(errr);
        setvisible(false);
      });
  };

  const update_credentials = async () => {
    const mail_URL = 'https://mail.google.com/mail';
    if (data?.email == email && data?.password == password) {
      setvisible(false);
    } else {
      if (data?.email !== email) {
        setcredentials_verify('email');
        setchange_credentials_modal(true);
      }
      if (data?.password !== password) {
        setcredentials_verify('password');
        setchange_credentials_modal(true);
      }
    }
  };

  const update_password = async () => {
    const mail_URL = 'https://mail.google.com/mail/u/0/#inbox';
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(async res => {
        await Linking.openURL(mail_URL);
        setchange_credentials_modal(false);
        save_data();
      })
      .then(res => {
        setvisible(false);
      })
      .catch(async error => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log('err', errorMessage);
      });
  };

  const image = async () => {
    await ImagePicker.openPicker({
      width: 500,
      height: 500,
      mediaType: 'photo',
    })
      .then(image => {
        setimages(image?.path);
      })
      .catch(error => {
        console.log(error.code);
        if (error?.code == 'E_PICKER_CANCELLED') {
          console.log('Pick Cancelled');
        }
      });
  };

  const followers_data = async () => {
    let Followers_data = [];
    let following_data = [];
    await firestore()
      ?.collection('users')
      ?.doc(auth()?.currentUser?.uid)
      ?.get()
      ?.then(res => {
        if (res?.data()?.followers) {
          setfollowers([]);
          Followers_data = [];
          res?.data()?.followers.map(
            async followers =>
              await firestore()
                ?.collection('users')
                ?.doc(followers)
                ?.get()
                ?.then(res => {
                  Followers_data.push(res?.data());
                  // setfollowers(Followers_data);
                }),
          );
          setfollowers(Followers_data);
        }
        if (res?.data()?.following) {
          following_data = [];
          setfollowing([]);

          res?.data()?.following.map(following =>
            firestore()
              ?.collection('users')
              ?.doc(following)
              ?.get()
              ?.then(res => {
                following_data.push(res?.data());
                setfollowing(following_data);
              }),
          );
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header_navigation title={'Profile'} />
      <View style={styles?.profile_conatiner}>
        <Image style={styles?.profile} source={{uri: data?.profile_picture}} />
        <View style={styles?.counter_container}>
          <View style={styles?.count_container}>
            <View style={styles?.countr_container}>
              <Text style={styles?.counter_title}>{post.length}</Text>
              <Text style={styles?.counter_title}>Post</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                followers_data(), setfollowers_modal(true);
              }}
              style={styles?.countr_container}>
              <Text style={styles?.counter_title}>
                {' '}
                {data?.followers?.length}
              </Text>
              <Text style={styles?.counter_title}>Followers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles?.countr_container}
              onPress={() => {
                followers_data(), setfollowing_modal(true);
              }}>
              <Text style={styles?.counter_title}>
                {data?.following?.length}
              </Text>
              <Text style={styles?.counter_title}>Following</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setvisible(true)}>
            <Text style={styles?.edit_btn}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={
          post.length != 0
            ? styles?.post_containers
            : styles?.warnning_container
        }>
        {post.length == 0 ? (
          <Text style={styles?.warnning}>{strings?.NO_post}</Text>
        ) : (
          <FlatList
            data={post}
            numColumns={3}
            keyExtractor={item => item.path}
            bounces={false}
            renderItem={({item, index}) => {
              return (
                <View style={styles?.post_container}>
                  <Image
                    source={{uri: item?.path}}
                    style={styles?.post_image}
                  />
                </View>
              );
            }}
          />
        )}
      </View>

      <Modals
        visible={visible}
        containStyle={styles?.modal_contain}
        containerStyle={styles?.modal}
        animation="fade"
        close={setvisible}
        title="Edit Profile"
        contain={
          <ScrollView
            style={{
              width: '100%',
            }}>
            <View>
              <TouchableOpacity style={styles.img_container} onPress={image}>
                <Image
                  resizeMode="contain"
                  style={images != '' ? styles.img : styles.img2}
                  source={
                    images === '' ? {uri: data?.profile_picture} : {uri: images}
                  }
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text_Input
                style={styles?.inputs}
                placeholder={strings?.FirstName}
                ontextchange={e => setfirstname(e)}
                value={firstname}
              />
              <Text_Input
                style={styles?.inputs}
                placeholder={strings?.LastName}
                ontextchange={e => setlastname(e)}
                value={lastname}
              />
              <Text_Input
                style={styles?.inputs}
                placeholder={strings?.Phone}
                ontextchange={e => setphone(e)}
                value={phone}
              />
              <Text_Input
                style={styles?.inputs}
                placeholder={strings?.Email}
                ontextchange={e => setemail(e)}
                value={email}
              />
              <Text_Input
                style={styles?.inputs}
                placeholder={strings?.password}
                ontextchange={e => setpassword(e)}
                value={password}
              />
            </View>
            <Btn
              title="Save"
              style={styles?.btn}
              title_style={styles?.btn_title}
              onpress={() =>
                ValidationHandler(
                  firstname,
                  lastname,
                  email,
                  password,
                  phone,
                  null,
                  update_credentials(),
                )
              }
            />
            <Modals
              visible={change_credentials_modal}
              animation="fade"
              close={setchange_credentials_modal}
              contain={
                <View style={styles?.alert_container}>
                  <Text style={styles?.credentials_alert}>
                    {credentials_verify == 'password'
                      ? `You have submitted a password change request !`
                      : ''}
                  </Text>
                  <View style={styles?.btn_conatiner}>
                    <Btn
                      title="Yes"
                      onpress={() => {
                        update_password();
                      }}
                    />
                  </View>
                </View>
              }
            />
          </ScrollView>
        }
      />

      <Modals
        containStyle={styles?.modal_contain}
        containerStyle={styles?.modal}
        visible={followers_modal}
        close={setfollowers_modal}
        title="Followers"
        contain={
          <View
            style={
              followers.length == 0
                ? [styles?.follower_container, {alignItems: 'center'}]
                : styles?.follower_container
            }>
            {followers.length == 0 ? (
              <Text style={styles?.warnning}>{strings?.NO_Followers}</Text>
            ) : (
              <FlatList
                data={followers}
                renderItem={({item, index}) => {
                  return (
                    <View>
                      <View style={styles?.list}>
                        <View style={styles?.info}>
                          <Image
                            source={{uri: item?.profile_picture}}
                            style={styles?.profile_picture}
                          />
                          <Text style={styles?.user_name}>
                            {item?.full_name}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        }
      />

      <Modals
        containStyle={styles?.modal_contain}
        containerStyle={styles?.modal}
        visible={following_modal}
        close={setfollowing_modal}
        title="Following"
        contain={
          <View
            style={
              following.length == 0
                ? [styles?.follower_container, {alignItems: 'center'}]
                : styles?.follower_container
            }>
            {following.length == 0 ? (
              <Text style={styles?.warnning}>{strings?.NO_Followers}</Text>
            ) : (
              <FlatList
                data={following}
                renderItem={({item, index}) => {
                  return (
                    <View>
                      <View style={styles?.list}>
                        <View style={styles?.info}>
                          <Image
                            source={{uri: item?.profile_picture}}
                            style={styles?.profile_picture}
                          />
                          <Text style={styles?.user_name}>
                            {item?.full_name}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  dots: {
    width: wp(20),
    height: wp(20),
  },
  modal_contain: {
    width: '100%',
    justifyContent: 'flex-end',
    borderBottomRightRadius: 0,
    borderBottomStartRadius: 0,
  },
  modal: {
    justifyContent: 'flex-end',
  },
  title: {
    color: colors?.black,
    fontFamily: 'Outfit-Medium',
    fontSize: fs(25),
    alignSelf: 'center',
  },
  img_container: {
    width: wp(100),
    height: wp(100),
    backgroundColor: colors.light_gray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: hp(30),
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    resizeMode: 'cover',
  },
  img2: {
    width: '100%',
    resizeMode: 'cover',
    height: '100%',
  },
  inputs: {
    width: '100%',
    paddingVertical: Platform.OS === 'ios' ? hp(30) : hp(20),
  },
  btn: {
    width: '50%',
    alignSelf: 'center',
    marginTop: hp(50),
  },
  btn_title: {
    fontFamily: 'Outfit-Medium',
  },
  credentials_alert: {
    color: colors?.black,
    fontSize: fs(18),
    textAlign: 'center',
    fontFamily: 'Outfit-Medium',
  },
  alert_container: {
    width: '80%',
  },
  btn_conatiner: {
    flexDirection: 'row',
    gap: wp(15),
    justifyContent: 'center',
    marginTop: hp(20),
  },
  profile: {
    width: wp(70),
    height: wp(70),
    borderRadius: 50,
  },
  profile_conatiner: {
    paddingHorizontal: wp(20),
    flexDirection: 'row',
    paddingVertical: hp(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: colors?.light_gray,
    borderBottomWidth: 1,
    paddingBottom: hp(20),
  },
  count_container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: wp(30),
  },
  countr_container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter_title: {
    color: colors?.black,
    fontFamily: 'Outfit-Medium',
    fontSize: fs(15),
  },
  edit_btn: {
    color: colors?.blue,
    fontSize: fs(18),
    fontFamily: 'Outfit-Medium',
  },
  counter_container: {
    flex: 1,
    alignItems: 'center',
    gap: wp(10),
  },
  post_image: {
    width: wp(110),
    height: wp(110),
  },
  post_container: {
    marginBottom: hp(10),
    flexWrap: 'wrap',
    marginHorizontal: wp(5),
  },
  post_containers: {
    marginHorizontal: wp(7),
    marginVertical: hp(15),
    alignItems: 'flex-start',
  },
  warnning_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warnning: {
    color: colors?.black,
    marginVertical: hp(50),
  },
  follower_container: {
    width: '100%',
    maxHeight: hp(450),
    // backgroundColor: 'yellow',
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
    gap: wp(10),
  },
  user_name: {
    color: colors?.black,
    fontSize: fs(18),
    fontFamily: 'Outfit-Medium',
  },
});

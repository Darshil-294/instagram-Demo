import {
  Alert,
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

const Profile = () => {
  const [data, setdata] = useState([]);
  const [visible, setvisible] = useState(false);
  const [change_credentials_modal, setchange_credentials_modal] =
    useState(false);
  const [images, setimages] = useState([]);
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [email, setemail] = useState('');
  const [phone, setphone] = useState(Number);
  const [password, setpassword] = useState('');
  const [credentials_verify, setcredentials_verify] = useState('');
  const [confirm, setconfirm] = useState(false);

  useEffect(() => {
    user_data();
  }, [visible]);

  const DISPATCH = useDispatch();

  const user_data = async () => {
    try {
      await firestore()
        ?.collection('users')
        ?.doc(auth()?.currentUser?.uid)
        ?.get()
        ?.then(async res => {
          setdata(res?.data());
        })
        ?.then(res => {
          setfirstname(data?.firstname);
          setlastname(data?.lastname);
          setphone(data?.phone);
          setemail(data?.email);
          setpassword(data?.password);
          setimages(data?.profile_picture);
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  const save_data = async () => {
    // let url;
    // let user;
    // let reference;
    // let res;
    // if (data?.email === email || data?.password === password) {
    // }
    // if (images === data?.profile_picture) {
    //   url = data?.profile_picture;
    // } else {
    //   const filename = images?.substring(
    //     images?.lastIndexOf('/') + 1,
    //     images?.length,
    //   );
    //   await new Promise.all(
    //     (reference = firebase.storage()?.ref(filename)),
    //     (res = await reference.putFile(images)),
    //     (url = await firebase
    //       .storage()
    //       ?.ref(res.metadata.name)
    //       ?.getDownloadURL()),
    //   );
    // }
    // user = {
    //   uid: firebase?.auth().currentUser?.uid,
    //   firstname: firstname,
    //   lastname: lastname,
    //   email: email.toLocaleLowerCase(),
    //   password: password,
    //   profile_picture: url,
    //   full_name: firstname + ' ' + lastname,
    //   phone: phone,
    // };
    // await firestore()
    //   ?.collection('users')
    //   ?.doc(firebase?.auth().currentUser?.uid)
    //   ?.update(user)
    //   ?.then(() => {
    //     console.log('User add successfully!');
    //     DISPATCH(Current_User_Action(user));
    //     setvisible(false);
    //   })
    //   ?.catch(errr => {
    //     console.log(errr);
    //     setvisible(false);
    //   });
  };

  const update_credentials = async () => {
    const mail_URL = 'https://mail.google.com/mail';
    if (data?.email == email && data?.password == password) {
    } else {
      if (data?.email !== email) {
        const user = firebase.auth().currentUser;
        user
          .updateEmail('user01@gmail.com')
          .then(async res => {})
          .catch(error => {
            console.log('error', error);
          });

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

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => setvisible(true)}>
          <Image source={Images?.dots} style={styles?.dots} />
        </TouchableOpacity>
      </View>
      <Modals
        visible={visible}
        containStyle={styles?.modal_contain}
        containerStyle={styles?.modal}
        animation="slide"
        close={setvisible}
        contain={
          <ScrollView
            style={{
              width: '100%',
            }}>
            <Text style={styles?.title}>Edit Profile</Text>
            <View>
              <TouchableOpacity style={styles.img_container} onPress={image}>
                <Image
                  resizeMode="contain"
                  style={images != '' ? styles.img : styles.img2}
                  source={images === '' ? {uri: images} : {uri: images}}
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
          </ScrollView>
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
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // justifyContent: 'space-between',
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
});

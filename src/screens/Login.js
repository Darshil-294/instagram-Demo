import {
  Alert,
  Button,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fs, hp, wp} from '../helper/global';
import {strings} from '../helper/string';
import {TextInput} from 'react-native-gesture-handler';
import {Images} from '../helper/images';
import Btn from '../components/common/Btn';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth, {firebase} from '@react-native-firebase/auth';
import {colors} from '../helper/colors';
import {emailRegex} from '../helper/Regex';
import Modals from '../components/common/Modals';
import {StackActions} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {Current_User_Action} from '../redux/Actions/Actions';
import firestore from '@react-native-firebase/firestore';
import {Settings} from 'react-native-fbsdk-next';
import {LoginManager} from 'react-native-fbsdk-next';

const Login = ({navigation}) => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [error, seterror] = useState('');
  // const [visible, setvisible] = useState(false);
  const DISPATCH = useDispatch();
  const userdata = useSelector(state => state?.user?.currentuser);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '790636944576-pqt8jp8a0plvj2ufr22bbvq9l2bl49qf.apps.googleusercontent.com',
      iosClientId:
        '790636944576-i3pt0kvlbran8blgqr13t2g9b9dima7h.apps.googleusercontent.com',
    });
    Settings.setAppID('1021940875756227');
  }, []);

  const signinWithGoogle = async () => {
    try {
      await GoogleSignin?.hasPlayServices();
      const userInfo = await GoogleSignin?.signIn();
      console.log('idToken', idToken);
      const googleCredential = auth?.GoogleAuthProvider?.credential(
        userInfo.idToken,
      );
      // return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log('ERROR', error);
      // Alert.alert(error);
    }
  };

  const facebook_login = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const signInWithEmail = async () => {
    let user;
    let getData;
    seterror(true);
    await firebase
      ?.auth()
      ?.signInWithEmailAndPassword(email, password)
      ?.then(async () => {
        seterror(false);
        user = firebase.auth().currentUser.uid;
        console.log('uid', user);
        getData = await firestore()?.collection('users')?.doc(user)?.get();
        getData?.data()?.uid == user
          ? (DISPATCH(Current_User_Action(getData?.data())), console.log('ok'))
          : null;
      })
      ?.then(() => {
        seterror(false);
        navigation.navigate('Drawer');
      })
      ?.catch(error => {
        if (error?.code == 'auth/invalid-email') {
          seterror('Please enter a valid email address');
        } else if (error?.code == 'auth/wrong-password') {
          seterror('Please enter a valid password');
        } else if (error?.code == 'auth/invalid-login') {
          seterror('You are not Registered');
        } else if (error?.code == 'auth/internal-error') {
          seterror('Internal Error');
        }
        console.log('Catch Error', error);
      });
  };

  const validationHandler = () => {
    if (email == '') {
      Alert.alert('Enter Email');

      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Enter valid Email');
      return;
    }
    if (password == '' || password.trim().length == 0) {
      Alert.alert('Enter password');
      return;
    }
    signInWithEmail();
  };

  // const handleModalClose = () => {
  //   seterror(false);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.title_conatiner}>
          <Text style={styles.title}>{strings.Login_tit}</Text>
          <Text style={styles.discription}>{strings.Login_disc}</Text>
        </View>
        <View style={styles.input_con}>
          <Text style={styles.input_tit}>{strings.U_E_placeholder}</Text>
          <TextInput
            value={email}
            style={styles.inputs}
            onChangeText={e => setemail(e)}
            placeholder="Enter Email"
          />
          <Text style={styles.input_tit}>{strings.password}</Text>
          <TextInput
            value={password}
            style={styles.inputs}
            onChangeText={e => setpassword(e)}
            placeholder="Enter Password"
          />
          <TouchableOpacity style={styles.forgot}>
            <Text>{strings.forgotPassword}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.social_Auth}>
          <TouchableOpacity onPress={signinWithGoogle}>
            <Image style={styles.social_logo} source={Images.google_logo} />
          </TouchableOpacity>
          <TouchableOpacity onPress={facebook_login}>
            <Image style={styles.social_logo} source={Images.facebook_logo} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={styles.social_logo} source={Images.twitter_logo} />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Btn
          title={'Login'}
          style={styles.btn}
          title_style={styles.btn_title}
          onpress={validationHandler}
        />
        <View style={styles.ragister_acc}>
          <Text style={{color: colors.grey, fontSize: fs(16)}}>
            {strings.dont_acc}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.ragister}> {strings.ragister}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {error && (
        <Modals
          visible={true}
          transparent={true}
          close={seterror}
          contain={
            error == 'You are not Registered' || error == 'Internal Error' ? (
              <>
                <Text style={styles.error_title}>You are not Registered</Text>
                <Btn
                  style={styles.login_btn}
                  title="Register"
                  title_style={styles.login_title}
                  onpress={() => navigation.navigate('Register')}
                />
              </>
            ) : error == 'Internal Error' ? (
              <>
                <Text style={styles.error_title}>Internal Error</Text>
                <Btn
                  style={styles.login_btn}
                  title="ok"
                  title_style={styles.login_title}
                  onpress={() => seterror(false)}
                />
              </>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  title_conatiner: {
    marginTop: hp(70),
  },
  title: {
    fontSize: fs(28),
    fontFamily: 'Outfit-Semibold',
    color: 'black',
  },
  discription: {
    color: colors.grey,
    fontSize: fs(25),
    lineHeight: hp(40),
    marginTop: hp(15),
    fontFamily: 'Outfit-Regular',
  },
  inputs: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: hp(15),
    borderRadius: 15,
    marginBottom: hp(15),
    // paddingHorizontal: wp(15),
  },
  input_tit: {
    color: 'black',
    marginBottom: hp(5),
  },
  input_con: {
    marginTop: hp(50),
  },

  social_Auth: {
    flexDirection: 'row',
    gap: wp(25),
    justifyContent: 'center',
    marginTop: hp(40),
  },
  social_logo: {
    width: wp(30),
    height: wp(30),
  },
  forgot: {
    alignSelf: 'flex-end',
  },
  btn_title: {
    color: 'white',
    fontFamily: 'Outfit-Medium',
  },
  btn: {
    width: wp(300),
    height: hp(60),
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: hp(10),
  },
  form: {
    paddingHorizontal: wp(30),
  },
  ragister: {
    color: 'black',
    fontSize: fs(16),
  },
  ragister_acc: {
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  error_title: {
    fontSize: fs(22),
    fontFamily: 'Outfit-Medium',
  },
  login_btn: {
    // width: wp(80),
    // height: hp(40),
    marginTop: hp(20),
    paddingHorizontal: wp(20),
    // alignSelf: 'center',
  },
  login_title: {
    fontFamily: 'Outfit-Medium',
  },
});

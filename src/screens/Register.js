import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {fs, hp, wp} from '../helper/global';
import {strings} from '../helper/string';
import {Images} from '../helper/images';
import {colors} from '../helper/colors';
import ImagePicker from 'react-native-image-crop-picker';
import {Platform} from 'react-native';
import Text_Input from '../components/common/Text_Input';
import Btn from '../components/common/Btn';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Modals from '../components/common/Modals';
import {useDispatch} from 'react-redux';
import {Current_User_Action} from '../redux/Actions/Actions';
import {ValidationHandler} from '../helper/constants';

const Register = ({navigation}) => {
  const [images, setimages] = useState([]);
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [email, setemail] = useState('');
  const [phone, setphone] = useState(Number);
  const [password, setpassword] = useState('');
  const [passwordConfirmation, setpasswordConf] = useState('');
  const [modal, setmodal] = useState(false);

  const DISPATCH = useDispatch();

  const createuser = async () => {
    let url;
    await firebase
      ?.auth()
      ?.createUserWithEmailAndPassword(email, password)
      ?.then(async i => {
        setmodal(true);
        let filename = images?.path.substring(
          images?.path?.lastIndexOf('/') + 1,
          images?.path.length,
        );
        const reference = storage()?.ref(filename);
        const res = await reference.putFile(images?.path);
        url = await storage()?.ref(res.metadata.name)?.getDownloadURL();
        console.log('url', url);
      })
      .then(async () => {
        const user = {
          uid: firebase?.auth().currentUser?.uid,
          firstname: firstname,
          lastname: lastname,
          email: email.toLocaleLowerCase(),
          password: password,
          profile_picture: url,
          full_name: firstname + ' ' + lastname,
          savedPost: [],
          phone: phone,
          followers: [],
          request: [],
          following: [firebase?.auth()?.currentUser?.uid],
        };
        await firestore()
          ?.collection('users')
          ?.doc(firebase?.auth().currentUser?.uid)
          ?.set(user)
          ?.then(() => {
            console.log('User add successfully!');
            DISPATCH(Current_User_Action(user));
            navigation?.navigate('Drawer');
            setmodal(false);
          })
          ?.catch(errr => {
            console.log(errr);
            setmodal(false);
          });
      })
      .catch(error => {
        setmodal(false);
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('user already in use');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        console.log('err', error);
      });

    // await setuser();
  };

  const image = async () => {
    await ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        setimages(image);
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
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={10}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        contentContainerStyle={styles.scroll_container}>
        <View>
          <Text style={styles.title}>{strings.SignIn}</Text>
          <TouchableOpacity style={styles.img_container} onPress={image}>
            <Image
              resizeMode="contain"
              style={images != '' ? styles.img : styles.img2}
              source={images == '' ? Images.user : {uri: images?.path}}
            />
          </TouchableOpacity>
          <View style={styles.inputconatiner}>
            <Text_Input
              ontextchange={e => setfirstname(e)}
              placeholder={strings.FirstName}
              style={styles.inputs}
            />
            <Text_Input
              ontextchange={e => setlastname(e)}
              placeholder={strings.LastName}
              style={styles.inputs}
            />
            <Text_Input
              ontextchange={e => setemail(e)}
              placeholder={strings.Email}
              style={styles.inputs}
            />
            <Text_Input
              ontextchange={e => setphone(e)}
              placeholder={strings.Phone}
              style={styles.inputs}
              keybordType="phone-pad"
            />
            <Text_Input
              ontextchange={e => setpassword(e)}
              placeholder={strings.password}
              style={styles.inputs}
            />
            <Text_Input
              ontextchange={e => setpasswordConf(e)}
              placeholder={strings.Re_Password}
              style={styles.inputs}
            />
          </View>
          <View style={styles.social_Auth}>
            <TouchableOpacity>
              <Image style={styles.social_logo} source={Images.google_logo} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image style={styles.social_logo} source={Images.facebook_logo} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image style={styles.social_logo} source={Images.twitter_logo} />
            </TouchableOpacity>
          </View>
        </View>
        <Btn
          title={strings.SignUp}
          onpress={() =>
            ValidationHandler(
              firstname,
              lastname,
              email,
              password,
              phone,
              passwordConfirmation,
              createuser(),
            )
          }
          style={styles.btn}
          title_style={{fontFamily: 'Outfit-Medium'}}
        />
        <Modals visible={modal} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: fs(28),
    fontFamily: 'Outfit-SemiBold',
    color: 'black',
    alignSelf: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    resizeMode: 'contain',
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
  img2: {
    width: wp(80),
    resizeMode: 'contain',
    height: wp(80),
  },
  inputs: {
    marginBottom: Platform.OS === 'android' ? hp(20) : hp(30),
  },
  inputconatiner: {
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: wp(20),
    marginTop: hp(50),
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  btn: {
    alignSelf: 'center',
    fontFamily: 'Outfit-SemiBold',
    marginBottom: hp(20),
  },
  social_Auth: {
    flexDirection: 'row',
    gap: wp(25),
    justifyContent: 'center',
    marginTop: hp(20),
  },
  social_logo: {
    width: wp(30),
    height: wp(30),
  },
  scroll_container: {flex: 1, justifyContent: 'space-between'},
});

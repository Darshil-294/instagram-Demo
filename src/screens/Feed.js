import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Images} from '../helper/images';
import {fs, hp, wp} from '../helper/global';
import {colors} from '../helper/colors';
import ImagePicker from 'react-native-image-crop-picker';
import {strings} from '../helper/string';
import Text_Input from '../components/common/Text_Input';
import Btn from '../components/common/Btn';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Modals from '../components/common/Modals';
import storage from '@react-native-firebase/storage';
import {template} from '@babel/core';
import {useSelector} from 'react-redux';

const Feed = ({navigation}) => {
  const [images, setimages] = useState([]);
  const [title, settitle] = useState('');
  const [description, setdescription] = useState('');
  const [visible, setvisible] = useState(false);

  const profile_picture = useSelector(
    state => state?.user?.currentuser?.profile_picture,
  );

  const image = async () => {
    await ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: 'any',
      multiple: true,
    })
      .then(image => {
        // setvisible(true);
        const temp = [];
        image.map((item, index) => {
          temp.push({
            id: Date.now() + index + 1,
            path: item?.path,
            name: item?.path.substring(
              item?.path?.lastIndexOf('/') + 1,
              item?.path.length,
            ),
          });
        });
        setimages([...temp]);
        setvisible(false);
      })
      .catch(error => {
        setvisible(false);
        if (error?.code == 'E_PICKER_CANCELLED') {
          console.log('Pick Cancelled');
        }
      });
    setvisible(false);
  };

  const add_post = async () => {
    setvisible(true);
    let temp = [];
    const promises = await Promise.all(
      images.map(async item => {
        let reference = storage()?.ref(item?.name);
        let res = await reference?.putFile(item?.path);
        temp?.push({
          ...item,
          path: await storage()?.ref(res?.metadata?.name)?.getDownloadURL(),
        });
      }),
    );
    setvisible(false);
    await firestore()
      ?.collection('post')
      ?.doc(auth()?.currentUser?.uid)
      ?.set(
        {
          postList: firebase.firestore.FieldValue.arrayUnion({
            // uid: auth()?.currentUser?.uid,
            images: temp,
            title: title,
            description: description,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString('en-IN', {
              timeStyle: 'short',
            }),
            user_likes: [],
            profile_picture: profile_picture,
          }),
        },
        {merge: true},
      )
      ?.then(async () => {
        setvisible(false);
        setimages([]);
        console.log('post added successfully');
        settitle('');
        setdescription('');
        navigation?.navigate('Home');
      })
      ?.catch(errr => {
        setvisible(false);
        console.log('Add post ERROR', errr);
      });
  };

  const delete_images = id => {
    let image = images.filter(item => item?.id !== id);
    setimages(image);
  };

  const validate = async () => {
    if (images.length == 0) {
      Alert.alert('please select image');
    }
    if (title.trim() == '') {
      Alert.alert('please enter a title');
    } else if (description.trim() == '') {
      Alert.alert('please enter a description');
    } else {
      // setvisible(true);
      add_post();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>{strings.Add_post}</Text>
        <TouchableOpacity style={styles.add_post} onPress={image}>
          <Image source={Images.gallery} style={styles.gallery} />
          <Text style={styles.add_post_title}>{strings.Add_post}</Text>
        </TouchableOpacity>
        <View
          style={
            images.length == 0
              ? styles.image_container
              : [styles.image_container, styles.image_container_fill]
          }>
          {images.length == 0 ? (
            <Text style={styles.warning_title}>{strings?.No_image}</Text>
          ) : (
            <FlatList
              bounces={false}
              data={images}
              // horizontal
              numColumns={3}
              keyExtractor={item => item.path}
              renderItem={({item}) => {
                return (
                  <View style={{margin: wp(5)}}>
                    <TouchableOpacity
                      style={styles.close_btn}
                      onPress={() => delete_images(item?.id)}>
                      <Image style={styles.close} source={Images?.close} />
                    </TouchableOpacity>
                    <Image source={{uri: item?.path}} style={styles?.img} />
                  </View>
                );
              }}
            />
          )}
        </View>
        <View style={styles.inputs_container}>
          <Text_Input
            value={title}
            ontextchange={e => settitle(e)}
            placeholder={strings?.title}
            style={styles.inputs}
          />
          <Text_Input
            value={description}
            ontextchange={e => setdescription(e)}
            placeholder={strings?.description}
            style={styles.inputs}
          />
        </View>
      </View>
      <Btn
        title={strings?.post}
        style={styles?.Btn}
        title_style={styles?.btn_title}
        onpress={validate}
      />
      <Modals visible={visible} />
    </SafeAreaView>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // justifyContent: 'flex-start',
    alignItems: 'center',
  },
  gallery: {
    width: wp(25),
    height: wp(25),
    tintColor: colors.light_gray,
  },
  add_post: {
    borderWidth: 2,
    width: wp(80),
    height: hp(80),
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: colors.light_gray,
    borderRadius: 10,
    marginTop: hp(20),
  },
  title: {
    fontSize: fs(25),
    fontFamily: 'Outfit-Medium',
    marginTop: hp(20),
  },
  add_post_title: {
    color: colors.light_gray,
    fontFamily: 'Outfit-Medium',
    marginTop: hp(5),
    fontSize: fs(15),
    // padding: wp(10),
  },
  image_container: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: colors.light_gray,
    width: wp(300),
    height: hp(200),
    borderRadius: 10,
    marginTop: hp(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: wp(10),
  },
  image_container_fill: {
    // backgroundColor: 'red',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: wp(0),
    width: wp(275),
    // flex: 1,
  },
  warning_title: {
    fontSize: fs(18),
    fontFamily: 'Outfit-Medium',
    color: colors.light_gray,
  },
  close: {
    width: wp(10),
    height: wp(10),
    tintColor: colors?.white,
  },
  close_btn: {
    width: wp(20),
    height: wp(20),
    backgroundColor: colors?.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    position: 'absolute',
    right: 0,
    zIndex: 1,
    top: 1,
    // position: 'relative',
  },
  img: {
    width: wp(80),
    height: wp(80),
    position: 'relative',
    borderRadius: 10,
  },
  inputs: {
    width: wp(300),
    marginTop: hp(30),
    // marginTop
  },
  inputs_container: {
    marginTop: hp(30),
  },
  Btn: {
    width: wp(200),
    marginBottom: hp(20),
    // marginTop: hp(100),
  },
  btn_title: {
    fontFamily: 'Outfit-Medium',
  },
});

import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {hp, wp} from '../../helper/global';
import {Images} from '../../helper/images';

interface modals {
  visible?: boolean;
  transparent?: boolean;
  animation?: 'fade' | 'slide' | 'none';
  contain?: any;
  close?: any;
  containStyle?: TextStyle;
  containerStyle?: TextStyle;
}

const Indicator = (
  <View
    style={{
      backgroundColor: 'white',
      padding: wp(10),
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <ActivityIndicator size={'large'} color={'black'} />
  </View>
);

const Modals = ({
  visible = false,
  transparent = true,
  animation,
  contain,
  close,
  containStyle,
  containerStyle,
}: modals) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animation}>
      <View style={[styles.modal, containerStyle]}>
        {!contain ? (
          <View style={styles.indicator}>
            <ActivityIndicator size={'large'} color={'black'} />
          </View>
        ) : (
          <View style={[styles.contain, containStyle]}>
            <TouchableOpacity style={styles.colse} onPress={() => close(false)}>
              <Image source={Images.close} style={styles.img} />
            </TouchableOpacity>
            {contain}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default Modals;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#00000054',
  },
  contain: {
    backgroundColor: 'white',
    paddingHorizontal: wp(20),
    borderRadius: 10,
    paddingVertical: hp(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    backgroundColor: 'white',
    padding: wp(20),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: wp(12),
    height: wp(12),
  },
  colse: {
    // alignSelf: 'center',
    alignSelf: 'flex-end',
    marginBottom: hp(10),
  },
});

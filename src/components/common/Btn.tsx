import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC} from 'react';
import {fs, hp, wp} from '../../helper/global';

interface btn {
  onpress?: () => void;
  title: string;
  style?: TextStyle;
  title_style?: TextStyle;
}

const Btn: FC<btn> = ({onpress, title = 'ok', style, title_style}) => {
  return (
    <View>
      <TouchableOpacity style={[styles.btn, style]} onPress={onpress}>
        <Text style={[styles.title, title_style]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Btn;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'black',
    // width: wp(200),
    // height: hp(50),
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingVertical: wp(10),
  },
  title: {
    color: 'white',
    fontSize: fs(20),
  },
});

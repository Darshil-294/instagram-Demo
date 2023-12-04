import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
} from 'react-native';
import React, {FC} from 'react';
import {hp} from '../../helper/global';

interface input {
  placeholder: string;
  style?: TextStyle;
  placeholdercolor?: string;
  ontextchange?: (arg0: string) => string;
  editable?: boolean;
  value?: string;
  keybordType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'url';
}

const Text_Input: FC<input> = ({
  placeholder = 'Type here...',
  style,
  editable,
  ontextchange,
  placeholdercolor,
  value,
  keybordType,
}) => {
  return (
    <View>
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor={placeholdercolor}
        editable={editable}
        onChangeText={ontextchange}
        value={value}
        keyboardType={keybordType}
      />
    </View>
  );
};

export default Text_Input;

const styles = StyleSheet.create({
  input: {
    borderColor: 'black',
    borderBottomWidth: 1,
    paddingBottom: Platform.OS === 'android' ? 0 : hp(5),
    width: '100%',
  },
});

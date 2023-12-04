import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const hp = val => heightPercentageToDP((val * 100) / 812);
export const wp = val => widthPercentageToDP((val * 100) / 375);
export const fs = val => RFValue(val, 812);

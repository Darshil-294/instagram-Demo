import {Alert, LogBox} from 'react-native';
import {emailRegex} from '../helper/Regex';

export const ValidationHandler = (
  firstname,
  lastname,
  email,
  password,
  phone,
  conform_password,
  valid,
  if_password_mache,
) => {
  if (firstname == '' || firstname?.trim()?.length == 0) {
    Alert.alert('Please enter valid firstname');
    return;
  }

  if (lastname == '' || lastname?.trim()?.length == 0) {
    Alert.alert('Please enter valid lastname');
    return;
  }

  if (email == '') {
    Alert.alert('Enter Email');
    return;
  }

  if (!emailRegex?.test(email)) {
    Alert.alert('Enter valid Email');
    return;
  }

  if (parseInt(phone) == '' || parseInt(phone.length) == 0) {
    Alert.alert('Enter Valid phone number');
    return;
  }

  if (isNaN(phone)) {
    Alert.alert('Please enter valid phone number');
    return;
  }

  if (phone.length < 10) {
    Alert.alert('Enter minimum 10 number');
    return;
  }

  if (phone.length > 10) {
    Alert.alert('Enter maximum 10 number');
    return;
  }

  if (password == '' || password?.trim()?.length == 0) {
    Alert.alert('Enter password');
    return;
  }

  if (conform_password == '' || conform_password?.trim()?.length == 0) {
    Alert.alert('Enter conform password');
    return;
  }

  if (password != undefined || conform_password != undefined) {
    if (conform_password) {
      if (
        password !== conform_password ||
        conform_password?.trim()?.length == 0
      ) {
        Alert.alert('Password not matched');
        return;
      }
      if (password === conform_password) {
        if_password_mache;
      }
    } else {
      valid;
    }
  }
};

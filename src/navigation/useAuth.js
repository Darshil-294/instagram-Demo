import {firebase} from '@react-native-firebase/auth';
import {useEffect, useState} from 'react';

export default onAuth = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      subscriber();
    });
    // return subscriber;
  }, []);
  return {user};
};

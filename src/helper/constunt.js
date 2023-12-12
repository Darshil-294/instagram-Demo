// import {useEffect, useRef, useState} from 'react';
// import {useSelector} from 'react-redux';
// import firestore, {firebase} from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

// export const [data, setdata] = useState([]);
// export const [userdata, setUserdata] = useState({});
// export const [visible, setvisible] = useState(false);
// export const [refreshing, setRefreshing] = useState(false);
// export const [currentIndex, setcurrentIndex] = useState(1);
// export const [users, setusers] = useState([]);

// export const current_index = useRef(null);

// export const user = useSelector(state => state?.user?.currentuser);
// export const get_Data = async () => {
//   try {
//     setvisible(true);
//     setRefreshing(true);
//     firestore()
//       ?.collection('post')
//       ?.onSnapshot(querySnapshot => {
//         querySnapshot?.docs.length == 0
//           ? (setvisible(false), setRefreshing(false))
//           : querySnapshot?.forEach(documentSnapshot => {
//               if (documentSnapshot?.id == auth()?.currentUser?.uid) {
//                 documentSnapshot?.data()?.postList[0].user_likes.map(async i =>
//                   firestore()
//                     ?.collection('users')
//                     ?.doc(i)
//                     ?.onSnapshot(data => {
//                       setusers(data?.data()?.full_name);
//                     }),
//                 );
//                 temp = [...documentSnapshot?.data()?.postList];
//                 setdata(documentSnapshot?.data()?.postList);
//                 setvisible(false);
//                 setRefreshing(false);
//               }
//             });
//       });
//   } catch (error) {
//     setvisible(false);
//     setRefreshing(false);
//     console.log('error', error);
//   }
// };
// export const get_User_Data = async () => {
//   try {
//     setvisible(true);
//     setRefreshing(true);
//     firestore()
//       ?.collection('users')
//       ?.onSnapshot(async querySnapshot => {
//         querySnapshot?.docs.length == 0
//           ? (setvisible(false), setRefreshing(false))
//           : querySnapshot?.forEach(documentSnapshot => {
//               if (documentSnapshot?.id == auth()?.currentUser?.uid) {
//                 setUserdata(documentSnapshot?.data());
//                 setvisible(false);
//                 setRefreshing(false);
//               }
//             });
//       });
//   } catch (error) {
//     setvisible(false);
//     setRefreshing(false);
//     console.log('Error', error);
//   }
// };

// export const like_handler = async value => {
//   try {
//     await firestore()
//       ?.collection('post')
//       .doc(value?.uid)
//       .get()
//       .then(async d => {
//         await firestore()
//           ?.collection('post')
//           .doc(value?.uid)
//           .update({
//             postList: d.data().postList.map(i => {
//               if (i.id == value.id) {
//                 i.user_likes = [...i.user_likes, auth().currentUser.uid];
//                 return i;
//               }
//               return i;
//             }),
//           });
//       });
//   } catch (error) {
//     console.log('error', error);
//   }
// };

// export const un_like_handler = async value => {
//   await firestore()
//     ?.collection('post')
//     .doc(value?.uid)
//     .get()
//     .then(async d => {
//       await firestore()
//         ?.collection('post')
//         .doc(value?.uid)
//         .update({
//           postList: d.data().postList.map(i => {
//             if (i.id == value.id) {
//               i.user_likes = i.user_likes.filter(
//                 a => a !== auth().currentUser.uid,
//               );
//               return i;
//             }
//             return i;
//           }),
//         });
//     });
// };

// export const save_post_handler = async value => {
//   await firestore()
//     ?.collection('users')
//     .doc(value?.uid)
//     .update({
//       savedPost: firebase.firestore.FieldValue.arrayUnion(value?.id),
//     });
// };

// export const un_save_post_handler = async value => {
//   await firestore()
//     ?.collection('users')
//     .doc(value?.uid)
//     .update({
//       savedPost: firebase.firestore.FieldValue.arrayRemove(value?.id),
//     });
// };

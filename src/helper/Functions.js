import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const save_post_handler = async value => {
  await firestore()
    ?.collection('users')
    .doc(auth()?.currentUser?.uid)
    .update({
      savedPost: firebase.firestore.FieldValue.arrayUnion({
        id: value?.id,
        uid: value?.uid,
      }),
    });
};

export const un_save_post_handler = async value => {
  await firestore()
    ?.collection('users')
    .doc(auth()?.currentUser?.uid)
    .update({
      savedPost: firebase.firestore.FieldValue.arrayRemove({
        id: value?.id,
        uid: value?.uid,
      }),
    });
};

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

export const like_handler = async value => {
  try {
    await firestore()
      ?.collection('post')
      .doc(value?.uid)
      .get()
      .then(async d => {
        await firestore()
          ?.collection('post')
          .doc(value?.uid)
          .update({
            postList: d.data().postList.map(i => {
              if (i.id == value.id) {
                i.user_likes = [...i.user_likes, auth().currentUser.uid];
                return i;
              }
              return i;
            }),
          });
      });
  } catch (error) {
    console.log('error', error);
  }
};

export const un_like_handler = async value => {
  await firestore()
    ?.collection('post')
    .doc(value?.uid)
    .get()
    .then(async d => {
      await firestore()
        ?.collection('post')
        .doc(value?.uid)
        .update({
          postList: d.data().postList.map(i => {
            if (i.id == value.id) {
              i.user_likes = i.user_likes.filter(
                a => a !== auth().currentUser.uid,
              );
              return i;
            }
            return i;
          }),
        })
        .catch(err => {
          console.log(err);
        });
    });
};

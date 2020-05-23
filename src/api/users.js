import {
  googleProvider,
  firebaseAuth,
  firebaseConfig,
  db,
} from "../config/config";

export const usersStore = async (isSignedIn, user, authcode) => {
  if ((isSignedIn, user)) {
    let uid = user.uid;
    let userObject = {
      authCode: `${authcode}`,
      name: `${user.displayName}`,
      email: `${user.email}`,
      photoUrl: `${user.photoURL}`,
      refreshToken: `${user.refreshToken}`,
      uid: `${user.uid}`,
    };
    await db.collection("users").doc(`${uid}`).set(userObject);
  }
};

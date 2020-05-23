import {
  googleProvider,
  firebaseAuth,
  firebaseConfig,
  db,
} from "../config/config";

export const usersStore = async (isSignedIn, user, authcode) => {
  // console.log(user);
  // authcode.forEach((ele) => console.log(ele));
  // console.log("firebase auth is ", firebaseAuth);
  // console.log("Google provider is ", googleProvider);
  // console.log("firebase config is ", firebaseConfig);
  // console.log("user signed in is ", isSignedIn);
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
    await db
      .collection("users")
      .doc(`${uid}`)
      .collection("tasks")
      .add({ id: "modify me" });
    
    await db.collection("users").doc(`${uid}`).set(userObject);
  }
};

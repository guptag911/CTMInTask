import {
  googleProvider,
  firebaseAuth,
  firebaseConfig,
  db,
} from "../config/config";

export const usersStore = (isSignedIn = false) => {

  console.log("firebase auth is ", firebaseAuth);
  console.log("Google provider is ", googleProvider);
  console.log("firebase config is ", firebaseConfig);
  console.log("user signed in is ", isSignedIn);
  if (isSignedIn) {
    console.log(firebaseAuth.currentUser);
  }
};

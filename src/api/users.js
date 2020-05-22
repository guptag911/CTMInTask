import {
  googleProvider,
  firebaseAuth,
  firebaseConfig,
  db,
} from "../config/config";

export const usersStore = (isSignedIn = false) => {
  if (isSignedIn) {
    console.log(firebaseAuth.currentUser);
  }
};

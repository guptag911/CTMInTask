import { googleProvider, firebaseAuth } from "../config/config";

export const signIn = async () => {
  googleProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  googleProvider.addScope("https://www.googleapis.com/auth/gmail.readonly");
  firebaseAuth.useDeviceLanguage();
  const result = await firebaseAuth.signInWithPopup(googleProvider);

  console.log(result.user);

  return result;
};


export const signout = async () => {
  const result = firebaseAuth.signOut();
  return result;
};

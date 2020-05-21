import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAaQHOvz_m-PBJa2QFhCuT82aIzFc2ZQVI",
  authDomain: "ctmintask.firebaseapp.com",
  databaseURL: "https://ctmintask.firebaseio.com",
  projectId: "ctmintask",
  storageBucket: "ctmintask.appspot.com",
  messagingSenderId: "976993439770",
  appId: "1:976993439770:web:b7239996434ac0c01a41a3",
  measurementId: "G-N41XRHH978",
};

firebase.initializeApp(firebaseConfig);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const database = firebase.database();
export const firebaseAuth = firebase.auth();

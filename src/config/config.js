import firebase from "firebase";
import "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAaQHOvz_m-PBJa2QFhCuT82aIzFc2ZQVI",
  authDomain: "ctmintask.firebaseapp.com",
  databaseURL: "https://ctmintask.firebaseio.com",
  projectId: "ctmintask",
  storageBucket: "ctmintask.appspot.com",
  messagingSenderId: "976993439770",
  appId: "1:976993439770:web:b7239996434ac0c01a41a3",
  measurementId: "G-N41XRHH978",
  clientId:
    "976993439770-kjepaclantqdmd90t5nk2f7poh85t46n.apps.googleusercontent.com",
  scopes: [
    "email",
    "profile",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/tasks",
    "https://www.googleapis.com/auth/analytics",
  ],
  discoveryDocs: [
    "https://chat.googleapis.com/$discovery/rest?version=v1",
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
    "https://www.googleapis.com/discovery/v1/apis/drive/v2/rest",
    "https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest",
  ],
};

firebase.initializeApp(firebaseConfig);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
export const firebaseAuth = firebase.auth();
export const func = firebase.functions();

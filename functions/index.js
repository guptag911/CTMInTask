const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const express = require("express");

const firebaseApp = firebase.initializeApp(functions.config().firebase);

const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/* eslint-disable promise/always-return */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ctmintask.firebaseio.com",
});

const db = admin.firestore();

const authUrl =
  // eslint-disable-next-line no-template-curly-in-string
  "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=LcUQspyPyb8ATVkVEUN5KS4NuIxrI4mO&scope=read%3Aconfluence-content.summary%20read%3Aconfluence-space.summary%20read%3Aconfluence-props%20write%3Aconfluence-content%20read%3Aconfluence-content.all%20offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent";
// Auth

// Uer Auth
const userAuth =
  "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=LcUQspyPyb8ATVkVEUN5KS4NuIxrI4mO&scope=read%3Ame%20offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent";

app.get("/auth", (req, res) => {
  res.send(authUrl);
});

app.get("/user", (req, res) => {
  res.send(userAuth);
});

exports.api = functions.https.onRequest(app);
// auth functions
exports.newSignUp = functions.auth.user().onCreate(async (user) => {
  let userObject = {
    name: `${user.displayName}`,
    email: `${user.email}`,
    photoUrl: `${user.photoURL}`,
    refreshToken: `${user.tokensValidAfterTime}`,
    uid: `${user.uid}`,
  };

  return db.collection("users").doc(user.uid).create(userObject);
});

exports.onUserDelete = functions.auth.user().onDelete((user) => {
  const doc = db.collection("users").doc(user.uid);

  return doc.delete();
});

// ChatBot code

exports.helloHangoutsChat = functions.https.onRequest((req, res) => {
  if (req.method === "GET" || !req.body.message) {
    res.send(
      "Hello! This function is meant to be used in a Hangouts Chat " + "Room."
    );
  }
  console.log(req.body);

  const sender = req.body.message.sender.displayName;
  const image = req.body.message.sender.avatarUrl;

  const data = createMessage(sender, image);

  res.send(data);
});

function createMessage(displayName, imageURL) {
  const cardHeader = {
    title: "Hello " + displayName + "!",
  };

  const avatarWidget = {
    textParagraph: { text: "Your avatar picture: " },
  };

  const avatarImageWidget = {
    image: { imageUrl: imageURL },
  };

  const avatarSection = {
    widgets: [avatarWidget, avatarImageWidget],
  };

  return {
    cards: [
      {
        name: "Avatar Card",
        header: cardHeader,
        sections: [avatarSection],
      },
    ],
  };
}

/* eslint-disable promise/always-return */
const request = require("request-promise");
const NodeCache = require("node-cache");
const session = require("express-session");
const bodyParser = require("body-parser");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");

const app = express();

const refreshTokenStore = {};
const accessTokenCache = new NodeCache({ deleteOnExpire: true });

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ctmintask.firebaseio.com",
});

app.use(
  session({
    secret: Math.random().toString(36).substring(2),
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

const db = admin.firestore();

const authUrl =
  // eslint-disable-next-line no-template-curly-in-string
  "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=LcUQspyPyb8ATVkVEUN5KS4NuIxrI4mO&scope=read%3Aconfluence-content.summary%20read%3Aconfluence-space.summary%20read%3Aconfluence-props%20write%3Aconfluence-content%20read%3Aconfluence-content.all%20offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%23%2Fdash&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent";
// Auth

// Uer Auth
const userAuth =
  "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=LcUQspyPyb8ATVkVEUN5KS4NuIxrI4mO&scope=read%3Ame%20offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%23%2Fdash&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent";

// Hubspot
const hubAuth =
  "https://app.hubspot.com/oauth/authorize?client_id=49a97a69-1406-4a1d-8eb3-64b9cbed6126&scope=contacts%20sales-email-read&redirect_uri=http://localhost:3000/";

const jiraAuth =
  "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=LcUQspyPyb8ATVkVEUN5KS4NuIxrI4mO&scope=read%3Ajira-user%20read%3Ajira-work%20write%3Ajira-work%20offline_access&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%23%2Fdash&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent";

app.get("/auth", (req, res) => {
  res.send(authUrl);
});

app.get("/user", (req, res) => {
  res.send(userAuth);
});

app.get("/hub", (req, res) => {
  res.send(hubAuth);
});

app.get("/jira", (req, res) => {
  res.send(jiraAuth);
});

app.post("/code", async (req, res) => {
  const authCode = req.body.authCode;
  const config = {
    grant_type: "authorization_code",
    client_id: "49a97a69-1406-4a1d-8eb3-64b9cbed6126",
    client_secret: "0840ac22-bc6d-49dc-90f0-06b472924e17",
    redirect_uri: "http://localhost:3000/",
    code: `${authCode}`,
  };

  const options = {
    method: "POST",
    uri: "https://api.hubapi.com/oauth/v1/token",
    body: config,
    json: true,
  };

  const responseBody = await request(options);

  const tokens = JSON.parse(responseBody);
  refreshTokenStore[req.sessionID] = tokens.refresh_token;
  accessTokenCache.set(
    req.sessionID,
    tokens.access_token,
    Math.round(tokens.expires_in * 0.75)
  );

  res.send(tokens.access_token);
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

const arr = [];

// eslint-disable-next-line promise/catch-or-return
db.collection("users")
  .get()
  .then((res) => {
    res.docs.forEach((ele) => {
      const newObj = {};
      newObj.uid = ele.data().uid;
      newObj.email = ele.data().email;
      arr.push(newObj);
    });
  });

exports.helloHangoutsChat = functions.https.onRequest((req, res) => {
  if (req.method === "GET" || !req.body.message) {
    res.send(
      "Hello! This function is meant to be used in a Hangouts Chat " + "Room."
    );
  }
  console.log(arr);

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

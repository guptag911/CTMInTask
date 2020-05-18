const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const Session = require("express-session");
const cors = require("cors");
const { google } = require("googleapis");
const getQuote = require("./auth");

const app = express();

app.use(
  Session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cors());

admin.initializeApp();

// firestorec
const db = admin.firestore();

getQuote()
  .then((result) => {
    console.log(result);
    const quoteData = {
      quote: result.quote,
      author: result.author,
    };
    // eslint-disable-next-line promise/no-nesting
    return (
      // eslint-disable-next-line promise/no-nesting
      db
        .collection("sampleData")
        .doc("inspiration")
        .set(quoteData)
        // eslint-disable-next-line promise/always-return
        .then(() => {
          console.log("new quote written to db");
        })
    );
  })
  .catch((err) => console.log(err));
// auth

const oauth2Client = new google.auth.OAuth2(
  functions.config().service.client_id,
  functions.config().service.client_secret,
  functions.config().service.redirect_url
);

const scopes = [
  "https://www.googleapis.com/auth/blogger",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "openid",
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});

function handlingRefreshTokens() {
  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
  });

  oauth2Client.setCredentials({
    refresh_token: `STORED_REFRESH_TOKEN`,
  });
}

app.use("/login", (req, res) => {
  console.log(req.query);
  res.redirect(`${authUrl}`);
});

app.use("/authon", (req, res) => {
  console.log(req.session, req.query.code);
  let session = req.session;
  let code = req.query.code;

  oauth2Client
    .getToken(code)
    .then((tokens) => {
      console.log(tokens.tokens, "Hjahvfsejbveskvn");
      oauth2Client.setCredentials(tokens);
      session["tokens"] = tokens;
      handlingRefreshTokens();
      res.send("Thank you");
      return tokens;
    })
    .catch((err) => {
      console.log(err.message);
      res.send("Try Again!! Sorry");
    });
});

exports.app = functions.https.onRequest(app);

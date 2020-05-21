const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ctmintask.firebaseio.com",
});

const db = admin.firestore();

app.get("/sample", async (req, res) => {
  const data = await db.collection("sample").get();
  data.forEach((doc) => {
    res.json(doc.data());
  });
});

exports.api = functions.region("asia-east2").https.onRequest(app);

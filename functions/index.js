/* eslint-disable promise/always-return */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ctmintask.firebaseio.com",
});

const db = admin.firestore();

// auth functions
exports.newSignUp = functions.auth.user().onCreate(async (user) => {
  let userObject = {
    name: `${user.displayName}`,
    email: `${user.email}`,
    photoUrl: `${user.photoURL}`,
    refreshToken: `${user.tokensValidAfterTime}`,
    uid: `${user.uid}`,
  };

  return db.collection("users").doc(user.uid).set(userObject);
});

exports.onUserDelete = functions.auth.user().onDelete(async (user) => {
  const doc = db.collection("users").doc(user.uid);
  return doc.delete();
});

exports.syncData = functions.https.onCall(async (data, context) => {
  if (context.auth) {
    console.log(context.auth.uid);
    let ref = await db.collection(`users/${context.auth.uid}/tasks`).get();
    console.log(ref.docs);
    return ref.docs;
    // // eslint-disable-next-line promise/catch-or-return
    // sfRef.listCollections().then((collections) => {
    //   collections.forEach((collection) => {
    //     return collection;
    //   });
    // });
  }
});

// exports.scheduledFunction = functions.pubsub
//   .schedule("every 5 minutes")
//   .onRun((context) => {
//     console.log("This will be run every 5 minutes!");
//     return null;
//   });

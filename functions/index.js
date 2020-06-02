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

// eslint-disable-next-line promise/catch-or-return

const UIDData = async () => {

  let arr = {}
  try {
    let data = await db.collection("users").get();
    data.docs.forEach((ele) => {
      arr[ele.data().email] = ele.data().uid;
    });
    return arr;
  }
  catch (e) {
    return arr;
  }
}

exports.helloHangoutsChat = functions.https.onRequest(async (req, res) => {

  // let arr = await UIDData();
  // let data =await getDocTasks(arr['raybittu242@gmail.com']);
  // res.send(data);

  // if (req.method === "GET" || !req.body.message) {
  //   res.send(
  //     "Hello! This function is meant to be used in a Hangouts Chat " + "Room."
  //   );
  // }

  try {
    let arr = await UIDData();
    // console.log("arr is ", arr);
    // let data =await getDocTasks(arr['raybittu242@gmail.com']);
    // console.log("data is ", data);
    // console.log("arr is ", arr);
    // console.log("body is ", req.body);

    const sender = req.body.message.sender.displayName;
    const image = req.body.message.sender.avatarUrl;
    const email = req.body.message.sender.email
    const text = req.body.message.text;


    const data = await createMessage(sender, image, email, arr[email]);

    res.send(data);
  } catch (e) {
    console.log("in err", e);
    res.send({});
  }
});

const createMessage = async (displayName, imageURL, email, uid) => {

  console.log("arr email ", uid, email);
  const widgets = [{
    "widgets": [
      {
        "textParagraph": {
          "text": "<h2 background-color=\"#00ff00\"><b>Roses</b> are <font color=\"#ff0000\">red</font>,<br><i>Violets</i> are <font color=\"#0000ff\">blue</font></h2>"
        }
      }
    ]
  },
  {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>Roses</b> are <font color=\"#ff0000\">red</font>,<br><i>Violets</i> are <font color=\"#0000ff\">blue</font>"
        }
      }
    ]
  },
  {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>Roses</b> are <font color=\"#ff0000\">red</font>,<br><i>Violets</i> are <font color=\"#0000ff\">blue</font>"
        }
      }
    ]
  },
  {
    "widgets": [
      {
        "textParagraph": {
          "text": "<b>Roses</b> are <font color=\"#ff0000\">red</font>,<br><i>Violets</i> are <font color=\"#0000ff\">blue</font>"
        }
      }
    ]
  }
  ]

  try {
    // const data = await getDocTasks(arr[email]);
    let taskData = []
    let data = await db.collection('users').doc(uid).collection('tasks').doc('gsuite').collection('data').get();
    data.docs.forEach((element) => {
      if (!(element.data().status === "completed" && element.data().taskid === null)) {
        console.log("docs data ", element.data());
        let widgets = {
          "widgets": [
            {
              "textParagraph": {
                "text": element.data().task_desc
              }
            }
          ]
        }
        taskData.push(widgets);
      }
    })

    const notData = [
      {
        "widgets": [
          {
            "textParagraph": {
              "text": "<font color=\"#ff0000\">You do not have any task left.</font>"
            }
          }
        ]

      }
    ]

    return {
      "cards": [
        {
          "header": {
            "title": displayName,
            "subtitle": email,
            "imageUrl": imageURL,
            "imageStyle": "AVATAR"
          },
          "sections": taskData.length===0?notData:taskData
        }
      ]
    }
  } catch (e) {
    console.log("err is ", e);
    return {
      "cards": [
        {
          "header": {
            "title": displayName,
            "subtitle": email,
            "imageUrl": imageURL,
            "imageStyle": "AVATAR"
          },
          "sections": [
            {
              "widgets": [
                {
                  "textParagraph": {
                    "text": "<font color=\"#ff0000\">You Register first</font>"
                  }
                }
              ]

            }
          ]
        }
      ]
    }
  }
}




// const getDocTasks = async (uid) => {
//   let taskData = []
//   console.log("uid is ", uid);
//   try {
//     let data = await db.collection('users').doc(uid).collection('tasks').doc('gsuite').collection('data').get();
//     // console.log(data.docs);
//     for(var element in data.docs) {
//       console.log("docs data ", element.data());
//       let widgets = {
//         "widgets": [
//           {
//             "textParagraph": {
//               "text": element.data().task_desc
//             }
//           }
//         ]
//       }
//       taskData.push(widgets);
//     }
//     console.log("not error ");
//     return taskData;
//   }
//   catch (e) {
//     console.log("in error ", e);
//     return taskData;
//   }

// }
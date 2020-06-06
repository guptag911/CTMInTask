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
  console.log("code is ", authCode);
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
    form: config,
    json: true,
  };

  const tokens = await request(options);

  console.log("response data is ", tokens);

  // const tokens = JSON.parse(responseBody);
  // console.log("token is ", token);
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

  if (req.method === "GET" || !req.body.message) {
    res.send(
      "Hello! This function is meant to be used in a Hangouts Chat " + "Room."
    );
  }

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
    const textList = req.body.message.text.toLowerCase().split(" ");

    const showTasktext = { "show": 1, "task": 1, "tasks": 1 };
    showtaskcount = 0;
    for (let text in textList) {
      if (showTasktext[textList[text]]) {
        showtaskcount += 1;
      }
    }

    if (showtaskcount >= Object.keys(showTasktext).length - 1) {
      const data = await createMessage(sender, image, email, arr[email]);

      res.send(data);
    }

    const showEventText = { "show": 1, "calendar": 1, "event": 1, "events": 1 }
    showeventcount = 0;
    for (let text in textList) {
      if (showEventText[textList[text]]) {
        showeventcount += 1;
      }
    }

    if (showeventcount >= Object.keys(showEventText).length - 2) {
      const data = await getDocTasks(arr[email]);

      res.send({
        "cards": [
          {
            "header": {
              "title": sender,
              "subtitle": email,
              "imageUrl": image,
              "imageStyle": "AVATAR"
            },
            "sections": data
          }
        ]
      }
      );
    }

    else {
      res.send({
        "cards": [
          {
            "header": {
              "title": sender,
              "subtitle": email,
              "imageUrl": image,
              "imageStyle": "AVATAR"
            },
            "sections": [
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "Hello, <b>" + sender + "</b>."
                    }
                  }
                ]

              },
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": "To see Tasklists, type <font color=\"#ff0000\"><b>show tasks</b></font> <br /> or To see your calender Events, type <font color=\"#ff0000\"><b>show events</b></font>"
                    }
                  }
                ]

              }
            ]
          }
        ]
      }
      );
    }


    // const data = await createMessage(sender, image, email, arr[email]);

  } catch (e) {
    console.log("in err", e);
    res.send({
      "text": "Something went wrong"
    }
    );
  }
});

const createMessage = async (displayName, imageURL, email, uid) => {

  console.log("arr email ", uid, email);


  try {
    let taskData = []
    let data = await db.collection('users').doc(uid).collection('tasks').doc('gsuite').collection('data').get();
    data.docs.forEach((element) => {
      if (!(element.data().status === "completed" && element.data().taskid === null)) {
        console.log("docs data ", element.data());
        let widgets = {
          "widgets": [
            {
              "keyValue": {
                "topLabel": element.data().sender.split("<")[0],
                "content": element.data().task_desc,
                "contentMultiline": "true",
                "bottomLabel": element.data().sender.split("<")[0].split("(")[1].split(")")[0],
                "onClick": {
                  "openLink": {
                    "url": "https://ctmintask.web.app/"
                  }
                },
                "button": {
                  "textButton": {
                    "text": "Visit Document",
                    "onClick": {
                      "openLink": {
                        "url": element.data().url
                      }
                    }
                  }
                }
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
          "sections": taskData.length === 0 ? notData : taskData
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




const getDocTasks = async (uid) => {
  let EventData = []
  console.log("uid is ", uid);
  try {
    let data = await db.collection('users').doc(uid).collection('calender').get();
    // console.log(data.docs);
    data.docs.forEach((element) => {
      console.log("docs data ", element.data());
      let widgets = {
        "widgets": [
          {
            "keyValue": {
              "topLabel": element.data().creator,
              "content": element.data().summary,
              "contentMultiline": "true",
              "bottomLabel": new Date(element.data().start_time).toString(),
              "onClick": {
                "openLink": {
                  "url": "https://ctmintask.web.app/"
                }
              },
              "button": {
                "textButton": {
                  "text": "Visit Event",
                  "onClick": {
                    "openLink": {
                      "url": element.data().htmlLink
                    }
                  }
                }
              }
            }

          }
        ]
      }
      EventData.push(widgets);
    });
    return EventData;
  }
  catch (e) {
    console.log("in error ", e);
    return EventData;
  }

}
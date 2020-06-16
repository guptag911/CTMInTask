/* eslint-disable promise/always-return */
const request = require("request-promise");
const NodeCache = require("node-cache");
const session = require("express-session");
const bodyParser = require("body-parser");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");
const OptionSelecter = require("./chatbot/optiondata");
const { google } = require("googleapis");

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
  "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=LcUQspyPyb8ATVkVEUN5KS4NuIxrI4mO&scope=read%3Aconfluence-content.summary%20read%3Aconfluence-space.summary%20read%3Aconfluence-props%20write%3Aconfluence-content%20read%3Aconfluence-content.all%20search%3Aconfluence%20manage%3Aconfluence-configuration%20write%3Aconfluence-props%20write%3Aconfluence-file%20write%3Aconfluence-space%20offline_access&redirect_uri=https%3A%2F%2Fctmintask.web.app%2F%23%2Fdash&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent";
// Auth

// Uer Auth
const userAuth =
  "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=LcUQspyPyb8ATVkVEUN5KS4NuIxrI4mO&scope=read%3Ame%20offline_access&redirect_uri=https%3A%2F%2Fctmintask.web.app%2F%23%2Fdash&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent";

// Hubspot
const hubAuth =
  "https://app.hubspot.com/oauth/authorize?client_id=49a97a69-1406-4a1d-8eb3-64b9cbed6126&scope=contacts%20sales-email-read&redirect_uri=https://ctmintask.web.app/";

const jiraAuth =
  "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=LcUQspyPyb8ATVkVEUN5KS4NuIxrI4mO&scope=read%3Ajira-user%20read%3Ajira-work%20write%3Ajira-work%20offline_access&redirect_uri=https%3A%2F%2Fctmintask.web.app%2F%23%2Fdash&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent";

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

// ChatBot code for asynchronous msgs i.e for notifications:--------------------------------------

const ChatBotServiceAccount = require("./ctmintask-Bot-serviceKey.json");
const ChatBotAsyncMsg = async (space_name, text) => {
  console.log("in asyn funct ", space_name, text);

  const Botauth = await new google.auth.GoogleAuth({
    keyFile: "./ctmintask-Bot-serviceKey.json",
    scopes: ["https://www.googleapis.com/auth/chat.bot"],
  });

  const Chat = await google.chat({
    auth: Botauth,
    version: "v1",
  });

  const ChatRes = await Chat.spaces.messages.create({
    requestBody: {
      text: text,
    },
    parent: space_name,
  });

  console.log("chat response is ", ChatRes);
};

// scheduler for the notifications in Google Hangout Chat


exports.scheduledFunction = functions.pubsub.schedule('every 3 hours').onRun(async (context) => {
  console.log('This will be running every 3 hours!');
  const timeValue = 3* 60 * 60*1000;
  try {
    const space_name = await db.collection("users").orderBy("space_name").get();
    console.log("hubspot data is ", space_name.docs);
    space_name.docs.forEach(async (element) => {
      //for hubspot data:-----
      console.log("uid data is ", element.data().uid);
      const hubSpotData = await db.collection('users').doc(element.data().uid).collection('tasks').doc('hubspot').collection('data').where("engagement.type", "==", "TASK").get();

      let Hubspotcount = 0;
      console.log("hubspot data is ", hubSpotData.docs);
      hubSpotData.docs.forEach((ele) => {
        if (ele.data().engagement.timestamp >= new Date().getTime() && (ele.data().engagement.timestamp <= new Date().getTime() + timeValue)) {
          Hubspotcount += 1;
        }
      })

      const JiraData = await db.collection('users').doc(element.data().uid).collection('tasks').doc('atlassian').collection('jira').where("due_date", ">", "").get();

      let Jiracount = 0;
      console.log("hubspot data is ", JiraData.docs);
      JiraData.docs.forEach((ele) => {

        let dateData= ele.data().due_date;
        if(dateData){
          let dateList = ele.data().due_date.split("-");
          dateData = dateList[1] + "-" +dateList[0] + "-" + dateList[2];
          dateData = new Date(dateData).getTime();
        }
        if (dateData >= new Date().getTime() && (dateData <= new Date().getTime() + timeValue)) {
          Jiracount += 1;
        }
      })


      const ConfData = await db.collection('users').doc(element.data().uid).collection('tasks').doc('atlassian').collection('confluence').where("due_date", ">", "").get();

      let Confcount = 0;
      console.log("hubspot data is ", ConfData.docs);
      ConfData.docs.forEach((ele) => {
        let dateData= ele.data().due_date;
        if(dateData){
          let dateList = ele.data().due_date.split("-");
          dateData = dateList[1] + "-" +dateList[0] + "-" + dateList[2];
          dateData = new Date(dateData).getTime();
        }
        if (dateData >= new Date().getTime() && (dateData <= new Date().getTime() + timeValue)) {
          Confcount += 1;
        }
      })

      if (Hubspotcount || Jiracount || Confcount) {
        await ChatBotAsyncMsg(element.data().space_name, `You have total ${Hubspotcount} HubSpot tasks, ${Jiracount} Jira tasks and ${Confcount} Confluence tasks deadline within next 3 hours`);
      }
    })

  } catch (e) {
    console.log("error is ", e);
  }

  return null;
});

// eslint-disable-next-line promise/catch-or-return

const UIDData = async () => {
  let arr = {};
  try {
    let data = await db.collection("users").get();
    data.docs.forEach((ele) => {
      arr[ele.data().email] = ele.data().uid;
    });
    return arr;
  } catch (e) {
    return arr;
  }
};

exports.helloHangoutsChat = functions.https.onRequest(async (req, res) => {
  // let arr = await UIDData();
  // let data =await getDocTasks(arr['raybittu242@gmail.com']);
  // res.send(data);
  console.log("req data is ", req.body);

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
    const email = req.body.message.sender.email;
    if (req.body.space.type === "DM") {
      try {
        await db.collection("users").doc(arr[email]).update({
          space_name: req.body.space.name,
        });
      } catch (e) {
        await db.collection("users").doc(arr[req.body.user.email]).update({
          space_name: req.body.space.name,
        });
      }
    }

    // const Chatdata = await ChatBotAsyncMsg(req.body.space.name);

    const noanydata = {
      widgets: [
        {
          textParagraph: {
            text:
              '<font color="#ff0000">You do not have any assigned task.</font>',
          },
        },
      ],
    };

    const nocompleteddata = {
      widgets: [
        {
          textParagraph: {
            text:
              '<font color="#ff0000">You do not have any completed task.</font>',
          },
        },
      ],
    };

    const nopendingddata = {
      widgets: [
        {
          textParagraph: {
            text:
              '<font color="#ff0000">You do not have any pending task.</font>',
          },
        },
      ],
    };

    const noeventdata = {
      widgets: [
        {
          textParagraph: {
            text:
              '<font color="#ff0000">Your calendar does not have any event.</font>',
          },
        },
      ],
    };

    const nocompletedeventdata = {
      widgets: [
        {
          textParagraph: {
            text:
              '<font color="#ff0000">You do not have any completed event.</font>',
          },
        },
      ],
    };

    const nopendingeventddata = {
      widgets: [
        {
          textParagraph: {
            text:
              '<font color="#ff0000">You do not have any upcoming event.</font>',
          },
        },
      ],
    };

    const notrepliedmail = {
      widgets: [
        {
          textParagraph: {
            text:
              '<font color="#ff0000">You do not have any un-replied important mail.</font>',
          },
        },
      ],
    };

    if (req.body.type === "CARD_CLICKED") {
      let cardEmail = req.body.user.email;
      let cardSender = req.body.user.displayName;
      console.log("in swaitch case email is ", cardEmail);
      let data;
      switch (req.body.action.actionMethodName) {
        case "allConfluenceTasks":
          data = await ConfluenceGetAllTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(noanydata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "completedConfluenceTasks":
          data = await ConfluenceGetCompletdTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nocompleteddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "pendingConfluenceTasks":
          data = await ConfluenceGetPendingTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nopendingddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "allJiraTasks":
          data = await JiraGetAllTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(noanydata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "completedJiraTasks":
          data = await JiraGetCompletdTasks(arr[cardEmail], cardSender);
          // console.log("task length is ", data.length);
          if (data.length === 2) {
            data.push(nocompleteddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "pendingJiraTasks":
          data = await JiraGetPendingTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nopendingddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "allHubspotTasks":
          data = await HubspotGetAllTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(noanydata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "completedHubspotTasks":
          data = await HubspotGetCompletdTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nocompleteddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "pendingHubspotTasks":
          data = await HubspotGetPendingTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nopendingddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "HubspotNotes":
          data = await HubspotGetNotes(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(noanydata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "allNonRepliedMails":
          data = await ReplyMailGetAllNonRepliedMails(
            arr[cardEmail],
            cardSender
          );
          if (data.length === 2) {
            data.push(notrepliedmail);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "allDocsTasks":
          data = await DocsGetAllTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(noanydata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "completedDocsTasks":
          data = await DocsGetCompletedTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nocompleteddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "pendingDocsTasks":
          data = await DocsGetPendingTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nopendingddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "allSheetsTasks":
          data = await SheetsGetAllTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(noanydata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "completedSheetsTasks":
          data = await SheetsGetCompletedTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nocompleteddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "pendingSheetsTasks":
          data = await SheetsGetPendingTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nopendingddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "allSlidesTasks":
          data = await SlidesGetAllTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(noanydata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "completedSlidesTasks":
          data = await SlidesGetCompletedTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nocompleteddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "pendingSlidesTasks":
          data = await SlidesGetPendingTasks(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nopendingddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "allEvents":
          data = await EventsGetAllData(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(noeventdata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "completedEvents":
          data = await EventsGetCompletedData(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nocompletedeventdata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
        case "upcomingEvents":
          data = await EventsGetUpcomingData(arr[cardEmail], cardSender);
          if (data.length === 2) {
            data.push(nopendingeventddata);
          }
          res.send({
            actionResponse: {
              type: "UPDATE_MESSAGE",
            },
            cards: [
              {
                header: {
                  title: sender,
                  subtitle: cardEmail,
                  imageUrl: image,
                  imageStyle: "AVATAR",
                },
                sections: data,
              },
            ],
          });
          break;
      }
    }

    if (req.body.type === "MESSAGE") {
      res.send({
        cards: [
          {
            header: {
              title: sender,
              subtitle: email,
              imageUrl: image,
              imageStyle: "AVATAR",
            },
            sections: [
              {
                widgets: [
                  {
                    textParagraph: {
                      text:
                        "Hello, <b>" +
                        sender +
                        "</b>! Kindly select one option.",
                    },
                  },
                ],
              },
              {
                widgets: OptionSelecter,
              },
            ],
          },
        ],
      });
    }
  } catch (e) {
    console.log("in err", e);
    res.send({
      text: "Something went wrong",
    });
  }
});

//All the tasks/events functions for the ChatBot------------------------------------

const ConfluenceGetAllTasks = async (uid, sender) => {
  console.log("uid is ", uid);
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("atlassian")
      .collection("confluence")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        widgets: [
          {
            keyValue: {
              topLabel: element.data().space_name,
              content: element.data().task_name,
              contentMultiline: "true",
              bottomLabel: element.data().due_date
                ? new Date(element.data().due_date).toString()
                : "No Due date",
              onClick: {
                openLink: {
                  url: "https://ctmintask.web.app/",
                },
              },
              button: {
                textButton: {
                  text: "Task Link",
                  onClick: {
                    openLink: {
                      url: element.data().url,
                    },
                  },
                },
              },
            },
          },
        ],
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const ConfluenceGetCompletdTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("atlassian")
      .collection("confluence")
      .where("status", "==", "complete")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        widgets: [
          {
            keyValue: {
              topLabel: element.data().space_name,
              content: element.data().task_name,
              contentMultiline: "true",
              bottomLabel: element.data().due_date
                ? new Date(element.data().due_date).toString()
                : "No Due date",
              onClick: {
                openLink: {
                  url: "https://ctmintask.web.app/",
                },
              },
              button: {
                textButton: {
                  text: "Task Link",
                  onClick: {
                    openLink: {
                      url: element.data().url,
                    },
                  },
                },
              },
            },
          },
        ],
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const ConfluenceGetPendingTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("atlassian")
      .collection("confluence")
      .where("status", "==", "incomplete")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        widgets: [
          {
            keyValue: {
              topLabel: element.data().space_name,
              content: element.data().task_name,
              contentMultiline: "true",
              bottomLabel: element.data().due_date
                ? new Date(element.data().due_date).toString()
                : "No Due date",
              onClick: {
                openLink: {
                  url: "https://ctmintask.web.app/",
                },
              },
              button: {
                textButton: {
                  text: "Task Link",
                  onClick: {
                    openLink: {
                      url: element.data().url,
                    },
                  },
                },
              },
            },
          },
        ],
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    return Taskdata;
  }
};

const JiraGetAllTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("atlassian")
      .collection("jira")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        widgets: [
          {
            keyValue: {
              topLabel: element.data().project_name,
              content: element.data().issue_name,
              contentMultiline: "true",
              bottomLabel: element.data().due_date
                ? new Date(element.data().due_date).toString()
                : "No Due date",
              onClick: {
                openLink: {
                  url: "https://ctmintask.web.app/",
                },
              },
              button: {
                textButton: {
                  text: "Task Link",
                  onClick: {
                    openLink: {
                      url: element.data().url,
                    },
                  },
                },
              },
            },
          },
        ],
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const JiraGetCompletdTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("atlassian")
      .collection("jira")
      .where("status", "==", "complete")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        widgets: [
          {
            keyValue: {
              topLabel: element.data().project_name,
              content: element.data().issue_name,
              contentMultiline: "true",
              bottomLabel: element.data().due_date
                ? new Date(element.data().due_date).toString()
                : "No Due date",
              onClick: {
                openLink: {
                  url: "https://ctmintask.web.app/",
                },
              },
              button: {
                textButton: {
                  text: "Task Link",
                  onClick: {
                    openLink: {
                      url: element.data().url,
                    },
                  },
                },
              },
            },
          },
        ],
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const JiraGetPendingTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("atlassian")
      .collection("jira")
      .where("status", "==", "incomplete")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        widgets: [
          {
            keyValue: {
              topLabel: element.data().project_name,
              content: element.data().issue_name,
              contentMultiline: "true",
              bottomLabel: element.data().due_date
                ? new Date(element.data().due_date).toString()
                : "No Due date",
              onClick: {
                openLink: {
                  url: "https://ctmintask.web.app/",
                },
              },
              button: {
                textButton: {
                  text: "Task Link",
                  onClick: {
                    openLink: {
                      url: element.data().url,
                    },
                  },
                },
              },
            },
          },
        ],
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const HubspotGetAllTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("hubspot")
      .collection("data")
      .where("engagement.type", "==", "TASK")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        widgets: [
          {
            keyValue: {
              topLabel: element.data().metadata.subject,
              content: element.data().engagement.bodyPreview,
              contentMultiline: "true",
              bottomLabel: new Date(
                element.data().engagement.timestamp
              ).toString(),
              onClick: {
                openLink: {
                  url: "https://ctmintask.web.app/",
                },
              },
              button: {
                textButton: {
                  text: "Task Link",
                  onClick: {
                    openLink: {
                      url: element.data().url,
                    },
                  },
                },
              },
            },
          },
        ],
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const HubspotGetCompletdTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("hubspot")
      .collection("data")
      .where("engagement.type", "==", "TASK")
      .get();
    data.docs.forEach((element) => {
      if (element.data().metadata.status === "COMPLETED") {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().metadata.subject,
                content: element.data().engagement.bodyPreview,
                contentMultiline: "true",
                bottomLabel: new Date(
                  element.data().engagement.timestamp
                ).toString(),
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "Task Link",
                    onClick: {
                      openLink: {
                        url: element.data().url,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const HubspotGetPendingTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("hubspot")
      .collection("data")
      .where("engagement.type", "==", "TASK")
      .get();
    data.docs.forEach((element) => {
      if (element.data().metadata.status !== "COMPLETED") {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().metadata.subject,
                content: element.data().engagement.bodyPreview,
                contentMultiline: "true",
                bottomLabel: new Date(
                  element.data().engagement.timestamp
                ).toString(),
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "Task Link",
                    onClick: {
                      openLink: {
                        url: element.data().url,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const HubspotGetNotes = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("hubspot")
      .collection("data")
      .where("engagement.type", "==", "NOTE")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        widgets: [
          {
            keyValue: {
              topLabel: element.data().engagement.sourceId,
              content: element.data().engagement.bodyPreview,
              contentMultiline: "true",
              bottomLabel: new Date(
                element.data().engagement.timestamp
              ).toString(),
              onClick: {
                openLink: {
                  url: "https://ctmintask.web.app/",
                },
              },
              button: {
                textButton: {
                  text: "Task Link",
                  onClick: {
                    openLink: {
                      url: element.data().url,
                    },
                  },
                },
              },
            },
          },
        ],
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const ReplyMailGetAllNonRepliedMails = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("gsuite")
      .collection("reply")
      .where("replied", "==", false)
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        widgets: [
          {
            keyValue: {
              topLabel: element.data().sender,
              content: element.data().subject,
              contentMultiline: "true",
              onClick: {
                openLink: {
                  url: "https://ctmintask.web.app/",
                },
              },
              button: {
                textButton: {
                  text: "Mail Link",
                  onClick: {
                    openLink: {
                      url: element.data().url,
                    },
                  },
                },
              },
            },
          },
        ],
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const DocsGetAllTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("gsuite")
      .collection("data")
      .get();
    data.docs.forEach((element) => {
      if (
        element.data().sender.split("<")[0].split("(")[1].split(")")[0] ===
        "Google Docs"
      ) {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().sender.split("<")[0],
                content: element.data().task_desc,
                contentMultiline: "true",
                bottomLabel: element
                  .data()
                  .sender.split("<")[0]
                  .split("(")[1]
                  .split(")")[0],
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "VISIT TASK",
                    onClick: {
                      openLink: {
                        url: element.data().url,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const DocsGetCompletedTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("gsuite")
      .collection("data")
      .get();
    data.docs.forEach((element) => {
      if (
        element.data().sender.split("<")[0].split("(")[1].split(")")[0] ===
          "Google Docs" &&
        element.data().status === true &&
        element.data().taskid === null
      ) {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().sender.split("<")[0],
                content: element.data().task_desc,
                contentMultiline: "true",
                bottomLabel: element
                  .data()
                  .sender.split("<")[0]
                  .split("(")[1]
                  .split(")")[0],
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "VISIT TASK",
                    onClick: {
                      openLink: {
                        url: element.data().url,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const DocsGetPendingTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("gsuite")
      .collection("data")
      .get();
    data.docs.forEach((element) => {
      if (
        element.data().sender.split("<")[0].split("(")[1].split(")")[0] ===
          "Google Docs" &&
        !(element.data().status === true && element.data().taskid === null)
      ) {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().sender.split("<")[0],
                content: element.data().task_desc,
                contentMultiline: "true",
                bottomLabel: element
                  .data()
                  .sender.split("<")[0]
                  .split("(")[1]
                  .split(")")[0],
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "VISIT TASK",
                    onClick: {
                      openLink: {
                        url: element.data().url,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const SheetsGetAllTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("gsuite")
      .collection("data")
      .get();
    data.docs.forEach((element) => {
      if (
        element.data().sender.split("<")[0].split("(")[1].split(")")[0] ===
        "Google Sheets"
      ) {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().sender.split("<")[0],
                content: element.data().task_desc,
                contentMultiline: "true",
                bottomLabel: element
                  .data()
                  .sender.split("<")[0]
                  .split("(")[1]
                  .split(")")[0],
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "VISIT TASK",
                    onClick: {
                      openLink: {
                        url: element.data().url,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const SheetsGetCompletedTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("gsuite")
      .collection("data")
      .get();
    data.docs.forEach((element) => {
      if (
        element.data().sender.split("<")[0].split("(")[1].split(")")[0] ===
          "Google Sheets" &&
        element.data().status === true &&
        element.data().taskid === null
      ) {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().sender.split("<")[0],
                content: element.data().task_desc,
                contentMultiline: "true",
                bottomLabel: element
                  .data()
                  .sender.split("<")[0]
                  .split("(")[1]
                  .split(")")[0],
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "VISIT TASK",
                    onClick: {
                      openLink: {
                        url: element.data().url,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const SheetsGetPendingTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("gsuite")
      .collection("data")
      .get();
    data.docs.forEach((element) => {
      if (
        element.data().sender.split("<")[0].split("(")[1].split(")")[0] ===
          "Google Sheets" &&
        !(element.data().status === true && element.data().taskid === null)
      ) {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().sender.split("<")[0],
                content: element.data().task_desc,
                contentMultiline: "true",
                bottomLabel: element
                  .data()
                  .sender.split("<")[0]
                  .split("(")[1]
                  .split(")")[0],
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "VISIT TASK",
                    onClick: {
                      openLink: {
                        url: element.data().url,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const SlidesGetAllTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("gsuite")
      .collection("data")
      .get();
    data.docs.forEach((element) => {
      if (
        element.data().sender.split("<")[0].split("(")[1].split(")")[0] ===
        "Google Slides"
      ) {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().sender.split("<")[0],
                content: element.data().task_desc,
                contentMultiline: "true",
                bottomLabel: element
                  .data()
                  .sender.split("<")[0]
                  .split("(")[1]
                  .split(")")[0],
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "VISIT TASK",
                    onClick: {
                      openLink: {
                        url: element.data().url,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const SlidesGetCompletedTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("gsuite")
      .collection("data")
      .get();
    data.docs.forEach((element) => {
      if (
        element.data().sender.split("<")[0].split("(")[1].split(")")[0] ===
          "Google Slides" &&
        element.data().status === true &&
        element.data().taskid === null
      ) {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().sender.split("<")[0],
                content: element.data().task_desc,
                contentMultiline: "true",
                bottomLabel: element
                  .data()
                  .sender.split("<")[0]
                  .split("(")[1]
                  .split(")")[0],
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "VISIT TASK",
                    onClick: {
                      openLink: {
                        url: element.data().url,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const SlidesGetPendingTasks = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("gsuite")
      .collection("data")
      .get();
    data.docs.forEach((element) => {
      if (
        element.data().sender.split("<")[0].split("(")[1].split(")")[0] ===
          "Google Slides" &&
        !(element.data().status === true && element.data().taskid === null)
      ) {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().sender.split("<")[0],
                content: element.data().task_desc,
                contentMultiline: "true",
                bottomLabel: element
                  .data()
                  .sender.split("<")[0]
                  .split("(")[1]
                  .split(")")[0],
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "VISIT TASK",
                    onClick: {
                      openLink: {
                        url: element.data().url,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const EventsGetAllData = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("calender")
      .orderBy("start_time", "ASC")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        widgets: [
          {
            keyValue: {
              topLabel: element.data().creator,
              content: element.data().summary,
              contentMultiline: "true",
              bottomLabel: `${new Date(
                element.data().start_time.toString()
              )} - ${new Date(element.data().end_time.toString())}`,
              onClick: {
                openLink: {
                  url: "https://ctmintask.web.app/",
                },
              },
              button: {
                textButton: {
                  text: "VISIT EVENT",
                  onClick: {
                    openLink: {
                      url: element.data().htmlLink,
                    },
                  },
                },
              },
            },
          },
        ],
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const EventsGetCompletedData = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("calender")
      .orderBy("start_time", "ASC")
      .get();
    data.docs.forEach((element) => {
      if (
        new Date(element.data().start_time).toISOString() <
        new Date().toISOString()
      ) {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().creator,
                content: element.data().summary,
                contentMultiline: "true",
                bottomLabel: `${new Date(
                  element.data().start_time.toString()
                )} - ${new Date(element.data().end_time.toString())}`,
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "VISIT EVENT",
                    onClick: {
                      openLink: {
                        url: element.data().htmlLink,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const EventsGetUpcomingData = async (uid, sender) => {
  let Taskdata = [];
  let wt = {
    widgets: [
      {
        textParagraph: {
          text: "Hello, <b>" + sender + "</b>! Kindly select one option.",
        },
      },
    ],
  };
  Taskdata.push(wt);
  wt = { widgets: OptionSelecter };
  Taskdata.push(wt);
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("calender")
      .orderBy("start_time", "ASC")
      .get();
    data.docs.forEach((element) => {
      if (
        new Date(element.data().start_time).toISOString() >=
        new Date().toISOString()
      ) {
        let widgets = {
          widgets: [
            {
              keyValue: {
                topLabel: element.data().creator,
                content: element.data().summary,
                contentMultiline: "true",
                bottomLabel: `${new Date(
                  element.data().start_time.toString()
                )} - ${new Date(element.data().end_time.toString())}`,
                onClick: {
                  openLink: {
                    url: "https://ctmintask.web.app/",
                  },
                },
                button: {
                  textButton: {
                    text: "VISIT EVENT",
                    onClick: {
                      openLink: {
                        url: element.data().htmlLink,
                      },
                    },
                  },
                },
              },
            },
          ],
        };
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

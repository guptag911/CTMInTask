/* eslint-disable promise/always-return */
const request = require("request-promise");
const NodeCache = require("node-cache");
const fm = require("dialogflow-fulfillment");
const { Card } = require("dialogflow-fulfillment");
const session = require("express-session");
const bodyParser = require("body-parser");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");
const OptionSelecter = require("./chatbot/optiondata");
const { google } = require("googleapis");
// const {
//   dialogflow,
//   BasicCard,
//   BrowseCarousel,
//   BrowseCarouselItem,
//   Button,
//   Carousel,
//   Image,
//   LinkOutSuggestion,
//   List,
//   MediaObject,
//   Suggestions,
//   SimpleResponse,
//  } = require('actions-on-google');

const app = express();

// const refreshTokenStore = {};
// const accessTokenCache = new NodeCache({ deleteOnExpire: true });

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ctmintask.firebaseio.com",
});

// app.use(
//   session({
//     secret: Math.random().toString(36).substring(2),
//     resave: false,
//     saveUninitialized: true,
//   })
// );

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



// ChatBot code for asynchronous msgs i.e for notifications:--------------------------------------

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  async (request, response) => {
    const agent = new fm.WebhookClient({ request, response });
    // console.log(
    //   "Dialogflow Request headers: " + JSON.stringify(request.headers)
    // );
    // request.body.originalDetectIntentRequest.payload.data.event.user.displayName
    // console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    const Email_UID = await UIDData();

    function welcome(agent) {
      agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }

    function name(agent) {
      agent.add(`My name is CTMInTask Bot`);
    }

    const hubspotPendingTasks = async (agent) => {
      const data = await HubspotGetPendingTasks(Email_UID[request.body.originalDetectIntentRequest.payload.data.event.user.email]);
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element)=>{
          agent.add(new Card(element));
        })
      }
      else {
        agent.add("You don't have any Hubspot pending tasks");
      }
    }



    const hubspotAllTasks = async (agent) => {
      const data = await HubspotGetAllTasks(Email_UID[request.body.originalDetectIntentRequest.payload.data.event.user.email]);
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element)=>{
          agent.add(new Card(element));
        })
      }
      else {
        agent.add("You don't have any Hubspot tasks");
      }
    }


    const hubspotCompletedTasks = async (agent) => {
      const data = await HubspotGetCompletedTasks(Email_UID[request.body.originalDetectIntentRequest.payload.data.event.user.email]);
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element)=>{
          agent.add(new Card(element));
        })
      }
      else {
        agent.add("You don't have any Hubspot completed tasks");
      }
    }

    const confluenceAllTasks = async (agent) => {
      const data = await ConfluenceGetAllTasks(Email_UID[request.body.originalDetectIntentRequest.payload.data.event.user.email]);
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element)=>{
          agent.add(new Card(element));
        })
      }
      else {
        agent.add("You don't have any Confluence tasks");
      }
    }

    const confluenceCompletedTasks = async (agent) => {
      const data = await ConfluenceGetCompletdTasks(Email_UID[request.body.originalDetectIntentRequest.payload.data.event.user.email]);
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element)=>{
          agent.add(new Card(element));
        })
      }
      else {
        agent.add("You don't have any Confluence completed tasks");
      }
    }


    const confluencePendingTasks = async (agent) => {
      const data = await ConfluenceGetPendingTasks(Email_UID[request.body.originalDetectIntentRequest.payload.data.event.user.email]);
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element)=>{
          agent.add(new Card(element));
        })
      }
      else {
        agent.add("You don't have any Confluence pending tasks");
      }
    }






    // console.log("agent is ", agent);

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", fallback);
    intentMap.set("get-agent-name", name);
    intentMap.set("Hubspot-pending-tasks", hubspotPendingTasks);
    intentMap.set("Hubspot-all-tasks", hubspotAllTasks);
    intentMap.set("Hubspot-completed-tasks", hubspotCompletedTasks);
    intentMap.set("Confluence-pending-tasks", confluencePendingTasks);
    intentMap.set("Confluence-all-tasks", confluenceAllTasks);
    intentMap.set("Confluence-completed-tasks", confluenceCompletedTasks);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
  }
);





const HubspotGetPendingTasks = async (uid) => {
  let Taskdata = [];
  try {
    const data = await db.collection('users').doc(uid).collection('tasks').doc('hubspot').collection('data').where("engagement.type", "==", "TASK").get();
    data.docs.forEach((element) => {
      if (element.data().metadata.status !== "COMPLETED") {
        let widgets =
        {
            "title": element.data().metadata.subject,
            "text": element.data().engagement.bodyPreview,
            "buttonText":"VISIT TASK",
            "buttonUrl":element.data().url
        }
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
}



const HubspotGetAllTasks = async (uid) => {
  let Taskdata = [];
  try {
    const data = await db.collection('users').doc(uid).collection('tasks').doc('hubspot').collection('data').where("engagement.type", "==", "TASK").get();
    data.docs.forEach((element) => {
      let widgets =
        {
            "title": element.data().metadata.subject,
            "text": element.data().engagement.bodyPreview,
            "buttonText":"VISIT TASK",
            "buttonUrl":element.data().url
        }
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }

}



const HubspotGetCompletedTasks = async (uid) => {
  let Taskdata = [];
  try {
    const data = await db.collection('users').doc(uid).collection('tasks').doc('hubspot').collection('data').where("engagement.type", "==", "TASK").get();
    data.docs.forEach((element) => {
      if (element.data().metadata.status === "COMPLETED") {
        let widgets =
        {
            "title": element.data().metadata.subject,
            "text": element.data().engagement.bodyPreview,
            "buttonText":"VISIT TASK",
            "buttonUrl":element.data().url
        }
        Taskdata.push(widgets);
      }
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
}



const ConfluenceGetAllTasks = async (uid) => {
  let Taskdata = [];
  try {
    const data = await db.collection('users').doc(uid).collection('tasks').doc('atlassian').collection('confluence').get();
    data.docs.forEach((element) => {
      let widgets =
        {
            "title": element.data().space_name,
            "text": element.data().task_name,
            "buttonText":"VISIT TASK",
            "buttonUrl":element.data().url
        }
      Taskdata.push(widgets);
    });
    return Taskdata;


  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
}


const ConfluenceGetCompletdTasks = async (uid) => {
  let Taskdata = [];
  try {
    const data = await db.collection('users').doc(uid).collection('tasks').doc('atlassian').collection('confluence').where("status", "==", "complete").get();
    data.docs.forEach((element) => {
      let widgets =
        {
            "title": element.data().space_name,
            "text": element.data().task_name,
            "buttonText":"VISIT TASK",
            "buttonUrl":element.data().url
        }
      Taskdata.push(widgets);
    });
    return Taskdata;


  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
}


const ConfluenceGetPendingTasks = async (uid) => {

  let Taskdata = [];
  
  try {
    const data = await db.collection('users').doc(uid).collection('tasks').doc('atlassian').collection('confluence').where("status", "==", "incomplete").get();
    data.docs.forEach((element) => {
      let widgets =
        {
            "title": element.data().space_name,
            "text": element.data().task_name,
            "buttonText":"VISIT TASK",
            "buttonUrl":element.data().url
        }
      Taskdata.push(widgets);
    });
    return Taskdata;

  } catch (e) {
    return Taskdata;
  }

}

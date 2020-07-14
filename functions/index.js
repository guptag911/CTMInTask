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

// ChatBot code for asynchronous msgs i.e for notifications:--------------------------------------

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  async (request, response) => {
    const agent = new fm.WebhookClient({ request, response });

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
      const data = await HubspotGetPendingTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add("You don't have any Hubspot pending tasks");
      }
    };

    const hubspotAllTasks = async (agent) => {
      const data = await HubspotGetAllTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add("You don't have any Hubspot tasks");
      }
    };

    const hubspotCompletedTasks = async (agent) => {
      const data = await HubspotGetCompletedTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add("You don't have any Hubspot completed tasks");
      }
    };

    const hubspotStarredTasks = async (agent) => {
      const data = await HubspotGetStarredTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );

      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add("You don't have any Hubspot pinned tasks");
      }
    };

    const confluenceAllTasks = async (agent) => {
      const data = await ConfluenceGetAllTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add("You don't have any Confluence tasks");
      }
    };

    const confluenceCompletedTasks = async (agent) => {
      const data = await ConfluenceGetCompletdTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add("You don't have any Confluence completed tasks");
      }
    };

    const confluencePendingTasks = async (agent) => {
      const data = await ConfluenceGetPendingTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add("You don't have any Confluence pending tasks");
      }
    };

    const confluenceStarredTasks = async (agent) => {
      const data = await ConfluenceGetStarredTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );

      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add("You don't have any Confluence pinned tasks");
      }
    };

    const jiraAllTasks = async (agent) => {
      const data = await JiraGetAllTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add("You don't have any Jira tasks");
      }
    };

    const jiraCompletedTasks = async (agent) => {
      const data = await JiraGetCompletdTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add("You don't have any Jira completed tasks");
      }
    };

    const jiraPendingTasks = async (agent) => {
      const data = await JiraGetPendingTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );
      // console.log(JSON.stringify(data));
      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add("You don't have any Jira pending tasks");
      }
	};
	
	const gsuiteAllTasks = async (agent) => {
		
		let data = await GsuiteAllTasks(
		Email_UID[
			request.body.originalDetectIntentRequest.payload.data.event.user.email
			]
		);
		if(data.length){
			data.forEach((element) => {
				agent.add(new Card(element));
			});
		} else{
			agent.add("You have No Tasks in your Gsuite");
		}
	};

	const gsuiteCompletedTasks = async (agent) => {
		let data = await GsuiteCompletedTasks(
		Email_UID[
			request.body.originalDetectIntentRequest.payload.data.event.user.email
			]
		);
		//console.log("Length of data", data.length);
		if(data.length){
			data.forEach((element) => {
				agent.add(new Card(element));
			});
		} else {
			agent.add("Uh Oh! you have no completed Gsuite Tasks!");
		}
	};

	const gsuitePendingTasks = async (agent) => {
		let data = await GsuitePendingTasks(
		Email_UID[
			request.body.originalDetectIntentRequest.payload.data.event.user.email
			]
		);
		console.log("Length of data ,", data.length);
		if(data.length){
			data.forEach((element) => {
				agent.add(new Card(element));
			});
		} else {
			agent.add("Congrats! You have no pending Gsuite tasks!");
		}
	}

    const jiraStarredTasks = async (agent) => {
      const data = await JiraGetStarredTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );

      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add("You don't have any Jira pinned tasks");
      }
    };

    const gsuiteStarredTasks = async (agent) => {
      const data = await GsuiteGetStarredTasks(
        Email_UID[
          request.body.originalDetectIntentRequest.payload.data.event.user.email
        ]
      );

      if (data.length) {
        data.forEach((element) => {
          agent.add(new Card(element));
        });
      } else {
        agent.add(
          "You don't have any pinned tasks from docs, slides or sheets"
        );
      }
    };

	const gsuiteAllDocs = async (agent) => {
		let data = await GsuiteAllDocs(
		Email_UID[
			request.body.originalDetectIntentRequest.payload.data.event.user.email
			]
		);
		if(data.length){
			data.forEach((element) => {
				agent.add(new Card(element));
			});
		}
		else{
			//console.log("No Data");
			agent.add("You have no tasks assigned in Google Docs");
		}
	};

	const gsuiteAllSheets = async (agent) => {
		let data = await GsuiteAllSheets(
		Email_UID[
			request.body.originalDetectIntentRequest.payload.data.event.user.email
			]
		);
		if(data.length){
			data.forEach((element) => {
				agent.add(new Card(element));
			});
		}
		else{
			//console.log("No Data");
			agent.add("You have no tasks assigned in Google Sheets");
		}
	};

	const gsuiteAllSlides = async (agent) => {
		let data = await GsuiteAllSlides(
		Email_UID[
			request.body.originalDetectIntentRequest.payload.data.event.user.email
			]
		);
		if(data.length){
			data.forEach((element) => {
				agent.add(new Card(element));
			});
		}
		else{
			//console.log("No Data");
			agent.add("You have no tasks assigned in Google Slides");
		}
	};

	const gsuiteCompletedDocs = async (agent) => {
		let data = await GsuiteCompletedDocs(
			Email_UID[
				request.body.originalDetectIntentRequest.payload.data.event.user.email
				]
			);
			if(data.length){
				data.forEach((element) => {
					agent.add(new Card(element));
				});
			}
			else{
				//console.log("No Data");
				agent.add("Uh Oh! You have no completed google docs!");
			}
	};

	const gsuitePendingDocs = async (agent) => {
		let data = await GsuitePendingDocs(
			Email_UID[
				request.body.originalDetectIntentRequest.payload.data.event.user.email
				]
			);
			if(data.length){
				data.forEach((element) => {
					agent.add(new Card(element));
				});
			}
			else{
				//console.log("No Data");
				agent.add("Congrats! You have no pending tasks in google docs!");
			}
	};

	const gsuiteCompletedSlides = async (agent) => {
		let data = await GsuiteCompletedSlides(
			Email_UID[
				request.body.originalDetectIntentRequest.payload.data.event.user.email
				]
			);
			if(data.length){
				data.forEach((element) => {
					agent.add(new Card(element));
				});
			}
			else{
				//console.log("No Data");
				agent.add("Uh Oh! You have no completed google slides!");
			}
	};

	const gsuitePendingSlides = async (agent) => {
		let data = await GsuitePendingSlides(
			Email_UID[
				request.body.originalDetectIntentRequest.payload.data.event.user.email
				]
			);
			if(data.length){
				data.forEach((element) => {
					agent.add(new Card(element));
				});
			}
			else{
				//console.log("No Data");
				agent.add("Congrats! You have no pending tasks in google slides!");
			}
	};

	const gsuiteCompletedSheets = async (agent) => {
		let data = await GsuiteCompletedSheets(
			Email_UID[
				request.body.originalDetectIntentRequest.payload.data.event.user.email
				]
			);
			if(data.length){
				data.forEach((element) => {
					agent.add(new Card(element));
				});
			}
			else{
				//console.log("No Data");
				agent.add("Uh Oh! You have no completed google sheets!");
			}
	};

	const gsuitePendingSheets = async (agent) => {
		let data = await GsuitePendingSheets(
			Email_UID[
				request.body.originalDetectIntentRequest.payload.data.event.user.email
				]
			);
			if(data.length){
				data.forEach((element) => {
					agent.add(new Card(element));
				});
			}
			else{
				//console.log("No Data");
				agent.add("Congrats! You have no pending tasks in google sheets!");
			}
	};
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
    intentMap.set("Jira-pending-tasks", jiraPendingTasks);
    intentMap.set("Jira-all-tasks", jiraAllTasks);
    intentMap.set("Jira-completed-tasks", jiraCompletedTasks);
    intentMap.set("jira-starred-tasks", jiraStarredTasks);
	intentMap.set("hubspot-starred-tasks", hubspotStarredTasks);
	intentMap.set("Gsuite-All-Tasks", gsuiteAllTasks);
    intentMap.set("Gsuite-starred-tasks", gsuiteStarredTasks);
	intentMap.set("confluence-starred-tasks", confluenceStarredTasks);
	intentMap.set("Gsuite-Completed-Tasks", gsuiteCompletedTasks);
	intentMap.set("Gsuite-Pending-Tasks", gsuitePendingTasks);
	intentMap.set("Gsuite-All-Docs", gsuiteAllDocs);
	intentMap.set("Gsuite-All-Slides", gsuiteAllSlides);
	intentMap.set("Gsuite-All-Sheets", gsuiteAllSheets);
	intentMap.set("Gsuite-Completed-Docs", gsuiteCompletedDocs);
	intentMap.set("Gsuite-Pending-Docs", gsuitePendingDocs);
	intentMap.set("Gsuite-Completed-Slides", gsuiteCompletedSlides);
	intentMap.set("Gsuite-Pending-Slides", gsuitePendingSlides);
	intentMap.set("Gsuite-Completed-Sheets", gsuiteCompletedSheets);
	intentMap.set("Gsuite-Pending-Sheets", gsuitePendingSheets);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
  }
);

const HubspotGetPendingTasks = async (uid) => {
  let Taskdata = [];
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
          title: element.data().metadata.subject,
          text: element.data().engagement.bodyPreview,
          buttonText: "VISIT TASK",
          buttonUrl: element.data().url,
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

const HubspotGetAllTasks = async (uid) => {
  let Taskdata = [];
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
        title: element.data().metadata.subject,
        text: element.data().engagement.bodyPreview,
        buttonText: "VISIT TASK",
        buttonUrl: element.data().url,
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const HubspotGetCompletedTasks = async (uid) => {
  let Taskdata = [];
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
          title: element.data().metadata.subject,
          text: element.data().engagement.bodyPreview,
          buttonText: "VISIT TASK",
          buttonUrl: element.data().url,
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

const HubspotGetStarredTasks = async (uid) => {
  let Taskdata = [];
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection("hubspot")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        title:
          element.data().engagement.type === "NOTE"
            ? element.data().engagement.bodyPreview
            : element.data().metadata.subject,
        text: element.data().engagement.bodyPreview,
        buttonText: "VISIT TASK",
        buttonUrl: element.data().url,
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const ConfluenceGetAllTasks = async (uid) => {
  let Taskdata = [];
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
        title: element.data().space_name,
        text: element.data().task_name,
        buttonText: "VISIT TASK",
        buttonUrl: element.data().url,
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const ConfluenceGetCompletdTasks = async (uid) => {
  let Taskdata = [];
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
        title: element.data().space_name,
        text: element.data().task_name,
        buttonText: "VISIT TASK",
        buttonUrl: element.data().url,
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const ConfluenceGetPendingTasks = async (uid) => {
  let Taskdata = [];

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
        title: element.data().space_name,
        text: element.data().task_name,
        buttonText: "VISIT TASK",
        buttonUrl: element.data().url,
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    return Taskdata;
  }
};

const ConfluenceGetStarredTasks = async (uid) => {
  let Taskdata = [];
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection("confluence")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        title: element.data().space_name,
        text: element.data().task_name,
        buttonText: "VISIT TASK",
        buttonUrl: element.data().url,
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const JiraGetAllTasks = async (uid) => {
  let Taskdata = [];
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
        title: element.data().project_name,
        text: element.data().issue_name,
        buttonText: "VISIT TASK",
        buttonUrl: element.data().url,
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const JiraGetCompletdTasks = async (uid) => {
  let Taskdata = [];
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
        title: element.data().project_name,
        text: element.data().issue_name,
        buttonText: "VISIT TASK",
        buttonUrl: element.data().url,
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const JiraGetPendingTasks = async (uid) => {
  let Taskdata = [];

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
        title: element.data().project_name,
        text: element.data().issue_name,
        buttonText: "VISIT TASK",
        buttonUrl: element.data().url,
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    return Taskdata;
  }
};

const GsuiteAllTasks = async (uid) => {
	let TaskData = [];
	try{
		const data = await db
			.collection("users")
			.doc(uid)
			.collection("tasks")
			.doc("gsuite")
			.collection("data")
			.get();
		//console.log("Data is", data);
		data.forEach(element => {
			let widgets = {
				title: "A task from " + element.data().sender,
				text : element.data().task_desc, 
				buttonText: "VISIT TASK",
				buttonUrl: element.data().url,
			};
			TaskData.push(widgets);
		});
		//console.log("Done computing tasks");
		return TaskData;
	} catch (e){
		console.log("Error is", e);
		return TaskData;
	}
};

const GsuitePendingTasks = async (uid) => {
	let TaskData = [];
	try{
		const data = await db
			.collection("users")
			.doc(uid)
			.collection("tasks")
			.doc("gsuite")
			.collection("data")
			.where("status", "==", "open")
			.get();
		//console.log("HEre rn!");
		data.forEach(element => {
			let widgets = {
				title: "A task from " + element.data().sender,
				text : element.data().task_desc, 
				buttonText: "VISIT TASK",
				buttonUrl: element.data().url,
			}
			TaskData.push(widgets);
		});
		//console.log("OK!");
		return TaskData;
	}catch (e){
		console.log("Error is, ",e);
		return TaskData;
	}
};

const GsuiteCompletedTasks = async (uid) => {
	let TaskData = [];
	try{
		const data = await db
			.collection("users")
			.doc(uid)
			.collection("tasks")
			.doc("gsuite")
			.collection("data")
			.where("status", "==", "resolved")
			.get();
		data.forEach(element => {
			let widgets = {
				title: "A task from " + element.data().sender,
				text : element.data().task_desc, 
				buttonText: "VISIT TASK",
				buttonUrl: element.data().url,
			}
			TaskData.push(widgets);
		});
		return TaskData;
	}catch (e){
		console.log("Exception Occured ", e);
		return TaskData;
	}
};


const JiraGetStarredTasks = async (uid) => {
  let Taskdata = [];
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection("jira")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        title: element.data().project_name,
        text: element.data().issue_name,
        buttonText: "VISIT TASK",
        buttonUrl: element.data().url,
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const GsuiteGetStarredTasks = async (uid) => {
  let Taskdata = [];
  try {
    const data = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection("gsuite")
      .get();
    data.docs.forEach((element) => {
      let widgets = {
        title: element.data().sender,
        text: element.data().task_desc,
        buttonText: "VISIT TASK",
        buttonUrl: element.data().url,
      };
      Taskdata.push(widgets);
    });
    return Taskdata;
  } catch (e) {
    console.log("error is ", e);
    return Taskdata;
  }
};

const GsuiteAllDocs = async (uid) => {
	let TaskData = [];
	try{
		const data = await db
			.collection("users")
			.doc(uid)
			.collection("tasks")
			.doc("gsuite")
			.collection("data")
			.get();
		var exp = new RegExp("Google Docs");
		data.forEach((element) => {
			var ref = (element.data().sender).toString();
			var res = ref.match(exp);
			if(res!==null)
			{
				let widgets = {
					title: element.data().sender,
					text: element.data().task_desc,
					buttonText: "VISIT TASK",
					buttonUrl: element.data().url,
				  };
				  TaskData.push(widgets);
			}
		});
		return TaskData;
	} catch(e){
		console.log("Exceotion Occured", e);
		return TaskData;
	}
};

const GsuitePendingDocs = async (uid) => {
	let TaskData = [];
	try{
		const data = await db
			.collection("users")
			.doc(uid)
			.collection("tasks")
			.doc("gsuite")
			.collection("data")
			.where("status", "==", "open")
			.get();
		var exp = new RegExp("Google Docs");
		data.forEach((element) => {
			var ref = (element.data().sender).toString();
			var res = ref.match(exp);
			if(res!==null)
			{
				let widgets = {
					title: element.data().sender,
					text: element.data().task_desc,
					buttonText: "VISIT TASK",
					buttonUrl: element.data().url,
				  };
				  TaskData.push(widgets);
			}
		});
		return TaskData;
	} catch(e){
		console.log("Exceotion Occured", e);
		return TaskData;
	}
};

const GsuiteCompletedDocs = async (uid) => {
	let TaskData = [];
	try{
		const data = await db
			.collection("users")
			.doc(uid)
			.collection("tasks")
			.doc("gsuite")
			.collection("data")
			.where("status", "==", "resolved")
			.get();
		var exp = new RegExp("Google Docs");
		data.forEach((element) => {
			var ref = (element.data().sender).toString();
			var res = ref.match(exp);
			if(res!==null)
			{
				let widgets = {
					title: element.data().sender,
					text: element.data().task_desc,
					buttonText: "VISIT TASK",
					buttonUrl: element.data().url,
				  };
				  TaskData.push(widgets);
			}
		});
		return TaskData;
	} catch(e){
		console.log("Exceotion Occured", e);
		return TaskData;
	}
};

const GsuiteAllSlides = async (uid) => {
	let TaskData = [];
	try{
		const data = await db
			.collection("users")
			.doc(uid)
			.collection("tasks")
			.doc("gsuite")
			.collection("data")
			.get();
		var exp = new RegExp("Google Slides");
		data.forEach((element) => {
			var ref = (element.data().sender).toString();
			var res = ref.match(exp);
			if(res!==null)
			{
				let widgets = {
					title: element.data().sender,
					text: element.data().task_desc,
					buttonText: "VISIT TASK",
					buttonUrl: element.data().url,
				  };
				  TaskData.push(widgets);
			}
		});
		return TaskData;
	} catch(e){
		console.log("Exceotion Occured", e);
		return TaskData;
	}
};

const GsuitePendingSlides = async (uid) => {
	let TaskData = [];
	try{
		const data = await db
			.collection("users")
			.doc(uid)
			.collection("tasks")
			.doc("gsuite")
			.collection("data")
			.where("status", "==", "open")
			.get();
		var exp = new RegExp("Google Slides");
		data.forEach((element) => {
			var ref = (element.data().sender).toString();
			var res = ref.match(exp);
			if(res!==null)
			{
				let widgets = {
					title: element.data().sender,
					text: element.data().task_desc,
					buttonText: "VISIT TASK",
					buttonUrl: element.data().url,
				  };
				  TaskData.push(widgets);
			}
		});
		return TaskData;
	} catch(e){
		console.log("Exceotion Occured", e);
		return TaskData;
	}
};

const GsuiteCompletedSlides = async (uid) => {
	let TaskData = [];
	try{
		const data = await db
			.collection("users")
			.doc(uid)
			.collection("tasks")
			.doc("gsuite")
			.collection("data")
			.where("status", "==", "resolved")
			.get();
		var exp = new RegExp("Google Slides");
		data.forEach((element) => {
			var ref = (element.data().sender).toString();
			var res = ref.match(exp);
			if(res!==null)
			{
				let widgets = {
					title: element.data().sender,
					text: element.data().task_desc,
					buttonText: "VISIT TASK",
					buttonUrl: element.data().url,
				  };
				  TaskData.push(widgets);
			}
		});
		return TaskData;
	} catch(e){
		console.log("Exceotion Occured", e);
		return TaskData;
	}
};


const GsuiteAllSheets = async (uid) => {
	let TaskData = [];
	try{
		const data = await db
			.collection("users")
			.doc(uid)
			.collection("tasks")
			.doc("gsuite")
			.collection("data")
			.get();
		var exp = new RegExp("Google Sheets");
		data.forEach((element) => {
			var ref = (element.data().sender).toString();
			var res = ref.match(exp);
			if(res!==null)
			{
				let widgets = {
					title: element.data().sender,
					text: element.data().task_desc,
					buttonText: "VISIT TASK",
					buttonUrl: element.data().url,
				  };
				  TaskData.push(widgets);
			}
		});
		return TaskData;
	} catch(e){
		console.log("Exceotion Occured", e);
		return TaskData;
	}
};

const GsuitePendingSheets = async (uid) => {
	let TaskData = [];
	try{
		const data = await db
			.collection("users")
			.doc(uid)
			.collection("tasks")
			.doc("gsuite")
			.collection("data")
			.where("status", "==", "open")
			.get();
		var exp = new RegExp("Google Sheets");
		data.forEach((element) => {
			var ref = (element.data().sender).toString();
			var res = ref.match(exp);
			if(res!==null)
			{
				let widgets = {
					title: element.data().sender,
					text: element.data().task_desc,
					buttonText: "VISIT TASK",
					buttonUrl: element.data().url,
				  };
				  TaskData.push(widgets);
			}
		});
		return TaskData;
	} catch(e){
		console.log("Exceotion Occured", e);
		return TaskData;
	}
};

const GsuiteCompletedSheets = async (uid) => {
	let TaskData = [];
	try{
		const data = await db
			.collection("users")
			.doc(uid)
			.collection("tasks")
			.doc("gsuite")
			.collection("data")
			.where("status", "==", "resolved")
			.get();
		var exp = new RegExp("Google Sheets");
		data.forEach((element) => {
			var ref = (element.data().sender).toString();
			var res = ref.match(exp);
			if(res!==null)
			{
				let widgets = {
					title: element.data().sender,
					text: element.data().task_desc,
					buttonText: "VISIT TASK",
					buttonUrl: element.data().url,
				  };
				  TaskData.push(widgets);
			}
		});
		return TaskData;
	} catch(e){
		console.log("Exceotion Occured", e);
		return TaskData;
	}
};
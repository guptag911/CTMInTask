import {
  googleProvider,
  firebaseAuth,
  firebaseConfig,
  db,
} from "../config/config";
import axios from "axios";
import { GsuiteDataSave, GsuiteDataGet, GsuiteGetId } from "./gsuiteApi";

//Only the tagged mails will be present in the database

/*
user_schema = {
  msg_id :  id of the mail
  subject : subject of the mail          
  url:  url of the mail
  replied: true if replied else false
}
*/


export const get_profile = async () => {
  try {
    console.log(window.gapi.client);
    var response = await window.gapi.client.gmail.users.getProfile({
      userId: "me",
    });

    console.log(response);
    return response.result.emailAddress;
  } catch (err) {
    console.log("Error!", err);
  }
};



export const get_username = async (email) => {
  try {
    var pos1 = email.match(/\./);
    var pos2 = email.match(/\@/);
    var first_name = email.substring(0, pos1["index"]);
    var last_name = email.substring(pos1["index"] + 1, pos2["index"]);
    first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1);
    last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1);
    var name = first_name + " " + last_name;
    return name;
  } catch (err) {
    console.log("Error!", err);
  }
};



export const get_a_msg = async (msg_ID) => {
  try {
    var response = await window.gapi.client.gmail.users.threads.get({
      userId: "me",
      id: msg_ID,
    });
    return response.result;
  } catch (err) {
    console.log("Error!", err);
  }
};

export const insert_task = async (new_task) => {
  try {
    var response = await window.gapi.client.tasks.tasks.insert({
      tasklist: "@default",
      resourse: new_task,
    });
    console.log("New task added!");
  } catch (err) {
    console.log("Error!", err);
  }
};

export const message_list = async () => {
  var ID_list = GsuiteGetId();
  var IDs = [];
  var user_schema = {};
  var email = await get_profile();
  var username = await get_username(email);
  var query = "@" + username;
  //Fetching messages IDs from Firestore
  (await ID_list).forEach((data) => {
    IDs.push(data);
  });
  try {
    var response = await window.gapi.client.gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 100, //change this
    });
    var messages = response.result.messages;
    var thread_ids = []; //Fetching IDs by calling API
    messages.forEach(async (element) => {
      if (IDs.includes(element.id)) {
        //checking if the id is in firestore databse
        try {
          /*const user_ID = firebaseAuth.currentUser.uid; //Getting unique user ID
              const user_ref = await db
                .collection("users")
                .doc(user_ID)
                .collection("tasks")
                .doc("gsuite")
                .collection("data")
                .doc(element.threadId)
                .get();
              var my_data = user_ref.data();
              var user_schema = {};*/
        } catch (err) {
          console.log("Error!", err);
        }
      } else {
        var msg_ID = element.id;
        user_schema["msg_id"] = msg_ID;
        var mail_data = await get_a_msg(msg_ID);
        var payload = mail_data.messages[0].payload;
        var header = payload["headers"];
        //fetching the subject
        header.forEach((head) => {
          if (head.name === "Subject") {
            user_schema["subject"] = head["value"];
          }
        });
        //fetching the url
        var url =
          "https://mail.google.com/mail/u/2/#inbox/" + msg_ID.toString();
        user_schema["url"] = url;
        //checking if the user is tagged in mail
        try {
          var msg_raw = payload["parts"][0].body.data;
          var data = msg_raw;
          var buff = new Buffer.from(data, "base64");
          var text = buff.toString();
          //console.log(text);
          query = new RegExp("@" + username + "  <" + email + ">");
          var index = text.match(query);
          if (index !== null) {
            //the user is tagged in this mail
            //fetching the last sender
            var last_index = response.data.messages.length - 1;
            var last_index_data = response.data.messages[last_index];
            var payload = last_index_data["payload"];
            var header = payload["headers"];
            var sender;
            header.forEach((head) => {
              if (head.name === "From") {
                sender = head["value"];
              }
            });
            query = new RegExp(email); //check if the last sender is user
            var pos = sender.match(query);
            if (pos !== null) {
              user_schema["replied"] = true;
              console.log("Already replied!");
            } else {
              user_schema["replied"] = false;
              var new_task = {
                title: user_schema["subject"].toString(),
                notes: user_schema["url"].toString(),
              };
              insert_task(new_task);
              console.log("Reply to this mail.");
            }
            //send user_schema to database
          } else console.log("Not a tagged mail.");
        } catch (err) {
          console.log("Error!", err);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};

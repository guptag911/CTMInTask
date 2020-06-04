import {
  googleProvider,
  firebaseAuth,
  firebaseConfig,
  db,
} from "../config/config";
import axios from "axios";
import { GsuiteDataSave, GsuiteDataGet, GsuiteGetId } from "./gsuiteApi";

//Only the relevant mails will be present in the database

/*
user_schema = {
  msg_id :  id of the mail
  subject : subject of the mail          
  url:  url of the mail
  replied: true if replied else false
  imp_mail: true or false according to the cloud function or null if it's the user's mail
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
    console.log(name);
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

//query parameter will be decided by the priority list
export const query_para = async (user_list) => {
    let query = 'is:important ';
    user_list.forEach((element) => {
        query += 'from:'+element+' OR ';
    });
    query.slice(0, query.length - 3);
    query += '-label:chats';
    return query;
}

export const message_list = async () => {
  let ID_list = GsuiteGetId();
  let IDs = [];
  let user_schema = {};
  let email = await get_profile();
  let username = await get_username(email);
  let query = '@'+username;
  //Fetching messages IDs from Firestore
  (await ID_list).forEach((data) => {
    IDs.push(data);
  });
  try {
    let response = await window.gapi.client.gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 100, 
    });
    let messages = response.result.messages;
    let thread_ids = [];  //Fetching IDs by calling API
    messages.forEach(async (element) => {
      if (IDs.includes(element.threadId)) {
        //checking if the id is in firestore databse
        try {
          //const user_ID = firebaseAuth.currentUser.uid; //Getting unique user ID
        } catch (err) {
          console.log("Error!", err);
        }
      } else {
        let msg_ID = element.threadId;
        user_schema["msg_id"] = msg_ID;
        let mail_data = await get_a_msg(msg_ID);
        let payload = mail_data.messages[0].payload;
        let header = payload["headers"];
        //fetching the subject
        header.forEach((head) => {
          if (head.name === "Subject") {
            user_schema["subject"] = head["value"];
          }
        });
        //fetching the url
        let url = "https://mail.google.com/mail/u/2/#inbox/" + msg_ID.toString();
        user_schema["url"] = url;
        //fetching the data of the last thread
        let last_index = mail_data.messages.length - 1;
        let last_index_data = mail_data.messages[last_index];
        payload = last_index_data["payload"];
        //fetching the body
        try {
          let header = payload["headers"];
          let sender;
          header.forEach((head) => {
              if (head.name === "From") {
                sender = head["value"];
              }
            });
          query = new RegExp(email);  //check if the last sender is user
          let pos = sender.match(query);
          if(pos == null)  // the sender is not the user
          {
          let msg_raw = payload["parts"][0].body.data;
          let data = msg_raw;
          let buff = new Buffer.from(data, "base64");
          let text = buff.toString();   //body of the thread
          //console.log(text);
          /*
            apply cloud functions to determine the mood and
            decide the value of user_schema['imp_mail']
            if true then user_schema['replied'] = false
            else user_schema['replied'] = true
            send to database only if user_schema['imp_mail'] = true
            and user_schema['replied'] = false
          */   
          }
          else  //the sender is the user
          {
            user_schema['replied'] = true;
            user_schema['imp_mail'] = null; 
          }
        } catch (err) {
          console.log("Error!", err);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};

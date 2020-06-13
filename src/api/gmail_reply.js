import { firebaseAuth, db } from "../config/config";
import { GsuiteDataSaveReply, GsuiteGetIdreply } from "./gsuiteApi";

//Read only those threads in UI whose user_schema['replied'] = false

/*
  user_schema = {
    thread_id :  thread id of the mail
    subject : subject of the mail          
    url:  url of the mail
    replied: true if replied else false
    sender: me or sender
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
    let pos1 = email.match(/\./);
    let pos2 = email.match(/\@/);
    let first_name = email.substring(0, pos1["index"]);
    let last_name = email.substring(pos1["index"] + 1, pos2["index"]);
    first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1);
    last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1);
    let name = first_name + " " + last_name;
    console.log(name);
    return name;
  } catch (err) {
    console.log("Error!", err);
  }
};

export const get_thread = async (thread_ID) => {
  try {
    let response = await window.gapi.client.gmail.users.threads.get({
      userId: "me",
      id: thread_ID,
    });
    return response.result;
  } catch (err) {
    console.log("Error!", err);
  }
};

//query parameter will be decided by the priority list
export const query_para = async (user_list) => {
  let query = "is:important ";
  user_list.forEach((element) => {
    query += "from:" + element + " OR ";
  });
  let result = query.slice(0, query.length - 3);
  result += "-label:chats " + "-invite.ics " + "-invite.vcs";
  return result;
};

export const my_nlp = (body) => {
  const word1 = /(important|asap|quick|urgent|quickly|due|immediately|emergency|vital|crucial|hurry up|intense|serious|critical|prior|priority|rushed|fast|hasty|dire)/i;
  const exp = new RegExp(word1);
  let pos = body.match(exp);
  if (pos == null) return "Low";
  else {
    return "High";
  }
};

export const message_list = async () => {
  let ID_list = await GsuiteGetIdreply();
  let IDs = [];
  let user_schema = {};
  let user_list = JSON.parse(window.localStorage.getItem("topEmails"));
  console.log("User list is: ", user_list);
  let my_list = [];
  for (let mail in user_list) {
    my_list.push(user_list[mail]);
  }
  console.log("My list is: ", my_list);
  let email = await get_profile();
  let username = await get_username(email);
  let query = (await query_para(my_list)).toString();
  //Fetching message IDs from Firestore
  (await ID_list).forEach((id) => {
    IDs.push(id);
  });
  console.log("IDs are", IDs);
  try {
    let response = await window.gapi.client.gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 100,
    });
    let messages = response.result.messages;
    messages.forEach(async (element) => {
      let thread_ID = element.threadId;
      let mail_data = await get_thread(thread_ID);
      //fetching the data of the last thread
      let last_index = mail_data.messages.length - 1;
      let last_index_data = mail_data.messages[last_index];
      let payload = last_index_data["payload"];
      //getting the last sender
      try {
        let header = payload["headers"];
        var sender;
        header.forEach((head) => {
          if (head.name === "From") {
            sender = head["value"];
          }
        });
        let query = new RegExp(email);
        let pos = sender.match(query);
        if (pos == null) {
          // the last sender is not the user
          user_schema["replied"] = false;
          user_schema["sender"] = sender;
        } //the last sender is the user
        else {
          user_schema["replied"] = true;
          user_schema["sender"] = "me";
        }
      } catch (err) {
        console.log("Error!", err);
      }
      // console.log("until that point man--------------------------------------id is", IDs, thread_ID);
      //if thread ID is already in the database
      if (IDs.includes(thread_ID)) {
        try {
          const uid =
            firebaseAuth.currentUser.uid === null
              ? JSON.parse(window.sessionStorage.getItem("user")).uid
              : firebaseAuth.currentUser.uid;
          const useref = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("gsuite")
            .collection("reply")
            .doc(thread_ID)
            .get();
          console.log(uid);
          let my_data = useref.data();
          my_data["replied"] = my_data["replied"] || user_schema["replied"];
          let Gdata = await GsuiteDataSaveReply(thread_ID, my_data);
        } catch (e) {
          console.log("Error is", e);
        }
        //change the replied status in the database accordingly
      } else {
        user_schema["thread_id"] = thread_ID;
        //fetching the subject
        let payload = mail_data.messages[0].payload;
        let body_data = payload.parts[0].body.data;
        // console.log(body_data, payload);
        let binaryData = Buffer.from(body_data, "base64");
        let parsed = binaryData.toString("utf8");
        let header = payload["headers"];
        header.forEach((head) => {
          if (head.name === "Subject") {
            user_schema["subject"] = head["value"];
          }
        });
        var my_priority = my_nlp(parsed);
        user_schema["priority"] = my_priority;

        //fetching the url
        let url =
          "https://mail.google.com/mail/u/2/#inbox/" + thread_ID.toString();
        user_schema["url"] = url;
        //send the schema into the database
        var Gdata = await GsuiteDataSaveReply(
          user_schema["thread_id"],
          user_schema
        );
        // console.log(user_schema);
      }
    });
  } catch (err) {
    console.log("Error!", err);
  }
};

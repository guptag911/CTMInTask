import {
  googleProvider,
  firebaseAuth,
  firebaseConfig,
  db,
} from "../config/config";
import axios from "axios";
import {
  GsuiteDataSaveReply,
  GsuiteDataGetReply,
  GsuiteGetIdreply,
} from "./gsuiteApi";

//Read only those threads in UI whose user_schema['replied'] = false

/*
  user_schema = {
    thread_id :  thread id of the mail
    subject : subject of the mail          
    url:  url of the mail
    replied: true if replied else false
    imp_mail: true or false according to the cloud function or null if it's the user's mail (Not used until NLP is applied)
    taskId: task Id of google task else null
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
  let query = "is:important ";
  user_list.forEach((element) => {
    query += "from:" + element + " OR ";
  });
  let result = query.slice(0, query.length - 3);
  result += "-label:chats " + "-invite.ics " + "-invite.vcs";
  return result; 
};

export const insert_task = async (data) => {
  try {
    return await new Promise(async (resolve) => {
      if (data["task_id"] == null) {
        if (data["replied"] == false) {
          var tite =
            "There is an Email that you might be intrested in replying.";
          var new_task = {
            title: tite,
            notes: data["url"],
          };
          try {
            // var go = await  window.gapi.client.tasks.tasks.insert(
            //     {tasklist : "@default"},
            //     new_task
            // );
            data["taskid"] = null;
          } catch (e) {
            console.log("Error is ", e);
          }
          resolve(data);
        } else {
          console.log("Already Replied");
          resolve(data);
        }
      } else {
        if (data["replied"] == true) {
          try {
            var task = window.gapi.client.tasks.tasks.get({
              tasklist: "@default",
              task: data["taskid"],
            });
            task.result["status"] = "completed";
            task.result["hidden"] = true;
            var result = window.gapi.client.tasks.tasks.update(
              { tasklist: "@default", task: task.result["id"] },
              task.result
            );
            data["taskid"] = null;
            resolve(data);
          } catch (e) {
            console.log("Error is ", e);
          }
        } else {
          console.log("Still not replied");
          resolve(data);
        }
        // task is already inserted, now cases handling will come.
      }
    });
  } catch (e) {
    console.log("error is", e);
  }
};

export const message_list = async () => {
  let ID_list = GsuiteGetIdreply();
  let IDs = [];
  let user_schema = {};
  let user_list = JSON.parse(window.localStorage.getItem("topEmails"));
  console.log("user list is ", user_list);
  let my_list = [];
  for (let mail in user_list) {
    my_list.push(user_list[mail]);
  }
  // user_list.forEach((id)=>{
  //     my_list.push(id);
  // });
  console.log("my list is ", my_list);
  let email = await get_profile();
  let username = await get_username(email);
  let query = (await query_para(my_list)).toString();
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
    messages.forEach(async (element) => {
      let thread_ID = element.threadId;
      let mail_data = await get_a_msg(thread_ID);
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
        }
      } catch (err) {
        console.log("Error!", err);
      }
      //if thread ID is already in the database
      if (IDs.includes(thread_ID)) {
        try {
          const uid = firebaseAuth.currentUser.uid;
          const useref = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("gsuite")
            .collection("reply")
            .doc(thread_ID)
            .get();

          var my_data = useref.data();
          my_data["replied"] = my_data["replied"] || user_schema["replied"];
          var mod_data = await insert_task(my_data["thread_id"], my_data);
          var Gdata = await GsuiteDataSaveReply(thread_ID, mod_data);
        } catch (e) {
          console.log("Error is", e);
        }
        //change the replied status in the database accordingly
      } else {
        user_schema["thread_id"] = thread_ID;
        //fetching the subject
        let payload = mail_data.messages[0].payload;
        let header = payload["headers"];
        header.forEach((head) => {
          if (head.name === "Subject") {
            user_schema["subject"] = head["value"];
          }
        });
        //fetching the url
        let url =
          "https://mail.google.com/mail/u/2/#inbox/" + thread_ID.toString();
        user_schema["url"] = url;
        user_schema["taskid"] = null;
        //send the schema into the database
        var new_data = await insert_task(user_schema);
        var Gdata = await GsuiteDataSaveReply(
          user_schema["thread_id"],
          new_data
        );
        //var dump = insert_task(user_schema);
        //console.log("dump is ", dump.data);
      }
    });
  } catch (err) {
    console.log("Error!", err);
  }
};

import {
  googleProvider,
  firebaseAuth,
  firebaseConfig,
  db,
} from "../config/config";
import axios from "axios";
import { GsuiteDataSave, GsuiteDataGet, GsuiteGetId } from "./gsuiteApi";

export const DataSave = async () => {
  try {
    const userRef = await db
      .collection("users")
      .doc("userID")
      .collection("tasks")
      .add({
        product: "Google Docs",
        completed: false,
        task: "do it",
        url: "task url",
      });
    // console.log("userRef is ", userRef);
  } catch (e) {
    console.log("error is ", e);
  }
};

export const GetData = async () => {
  db.collection("users")
    .doc("userID")
    .collection("tasks")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    });
};

var MY_SCHEMA = {
  mid: "Contains the message id/thread id  yes",
  u_mail: "User Email Address yes",
  date: "Assignment Date yes",
  sender: "Sender's Name",
  url: "URL of assigned Doc",
  file_id: "FileId of the doc",
  comment_id: "Comment ID will be UNIQUE",
  taskid: "Will be NONE if not in tasklist.",
  status:
    "Bool Tells weather the task was present ever in the tasklist or not.",
  task_desc: "task description",
};

const insert_task = async (data) => {
  var file_id = data["file_id"];
  var cmtid = data["comment_id"];
  try {
    var comment_list = await window.gapi.client.drive.comments.list({
      fileId: file_id,
      fields: "items/status, items/content, items/commentId",
    });
    var some_data = comment_list.result["items"];
    // console.log("comment list is ", some_data);

    return await new Promise((resolve) =>
      some_data.map(async (comments) => {
        if (comments["commentId"] === cmtid) {
          var title = comments["content"];
          //   console.log("title is ", title);
          try {
            if (comments["status"] === "open" && data["status"] === false) {
              try {
                var n_title = title;
                var results = await window.gapi.client.tasks.tasks.list({
                  tasklist: "@default",
                });
                // console.log("results is this ", results);
                // console.log("items is ", items);
                // var tasklist_id = items[0]['id']
                var new_task = {
                  title: n_title.toString(),
                  notes: data["url"].toString(),
                };
                // console.log("new task is ", new_task);
                var go = await window.gapi.client.tasks.tasks.insert(
                  { tasklist: "@default" },
                  new_task
                );
                // console.log("go is ", go);
                data["taskid"] = go.result["id"];
                // console.log("task id is ", data["taskid"], " and id ", data["mid"])
                data["status"] = true;
                // console.log("New Task Added");
                // console.log("Data is this new ", data);
                // console.log("yes no");
                resolve(data);
              } catch (err) {
                console.log("error is this ", err);
                // console.log("Data is this ", data);
                resolve(data);
              }
            } else if (
              comments["status"] === "resolved" &&
              data["status"] === true
            ) {
              if (data["taskid"] !== null) {
                try {
                  var task = await window.gapi.client.tasks.tasks.get({
                    tasklist: "@default",
                    task: data["taskid"],
                  });
                  //   console.log("task is ", task.result);
                  task.result["status"] = "completed";
                  task.result["hidden"] = true;
                  var result = await window.gapi.client.tasks.tasks.update(
                    { tasklist: "@default", task: task.result["id"] },
                    task.result
                  );
                  data["taskid"] = null;
                  //console.log("in null");
                  //   console.log("Assigned Task marked as done!");
                  //console.log("Data is this 2nd", data);
                  resolve(data);
                } catch (e) {
                  console(e);
                  //   console.log("Data is this 2nd err", data);
                  resolve(data);
                }
              } else {
                // console.log("Data is this ", data);
                resolve(data);
              }
            } else if (
              comments["status"] === "open" &&
              data["status"] === true
            ) {
              if (data["taskid"] !== null) {
                var task = await window.gapi.client.tasks.tasks.get({
                  tasklist: "@default",
                  task: data["taskid"],
                });
                var flag = task["status"];
                if (flag === "completed") {
                  var my_comment = window.gapi.client.drive.comments.get({
                    fileId: file_id,
                    commentId: cmtid,
                  });
                  my_comment["status"] = "resolved";
                  await window.gapi.client.drive.comments.update({
                    fileId: file_id,
                    commentId: cmtid,
                    body: my_comment,
                  });
                  await window.gapi.client.drive.comments.delete({
                    fileId: file_id,
                    commentId: cmtid,
                  });
                  console.log("Task mark as done from tasks");
                } else if (flag === "needsAction") {
                  console.log("Task Assigned but yet to be completed!");
                }
                // console.log("Data is this in ", data);
                resolve(data);
              } else {
                // console.log("Data is this ", data);
                resolve(data);
              }
            } else if (
              comments["status"] === "resolved" &&
              data["status"] === false
            ) {
              //   console.log("Task is already completed!");
              //   console.log("Data is this in ", data);
              resolve(data);
            }
          } catch (err) {
            console.log("err is ", err);
            // console.log("Data is this in ", data);
            resolve(data);
          }
        }
      })
    );
  } catch (err) {
    console.log("error is ", err);
    // console.log("Data is this in ", data);
    return data;
  }
  // });
};

const getIndvMail = async (mid) => {
  try {
    var response = await window.gapi.client.gmail.users.messages.get({
      userId: "me",
      id: mid,
    });
    return response.result;
  } catch (err) {
    console.log("individual error is ", err);
  }
};

export const MessageList = async () => {
  var Mails = [];
  var query = "in:inbox assigned you an action item";
  var Mlist = GsuiteGetId();
  var ids = [];
  (await Mlist).forEach((data) => {
    ids.push(data);
  });
  try {
    //list of mails fetching
    var response = await window.gapi.client.gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 100,
    });
    var messages = response.result.messages;
    var threadList = [];
    var userData = [];
    //console.log("total messages are ", response.result);
    messages.forEach(async (element) => {
      if (ids.includes(element.threadId)) {
        try {
          const uid = firebaseAuth.currentUser.uid;
          const userref = await db
            .collection("users")
            .doc(uid)
            .collection("tasks")
            .doc("gsuite")
            .collection("data")
            .doc(element.threadId)
            .get();
          var my_data = userref.data();
          var user_schema = {};
          user_schema = await insert_task(my_data);
          //   console.log("User Schema from if->", user_schema);
          var GData = await GsuiteDataSave(user_schema["mid"], user_schema);
          //   console.log("Updated GData is ", GData);
        } catch (e) {
          console.log("Some Error has occured", e);
        }
      } else {
        var userSchema = {};
        threadList.push(element.threadId);
        var mailData = await getIndvMail(element.threadId);
        Mails.push(mailData);
        userSchema["mid"] = element.threadId;
        userSchema["date"] = mailData.internalDate;
        var payload = mailData.payload;
        var text;
        //getting the url of docs
        try {
          var msg_raw = payload["parts"][0].body.data;
          var data = msg_raw;
          var buff = new Buffer.from(data, "base64");
          text = buff.toString();
          // console.log("---------------------------", text);
        } catch (err) {
          console.log("---------------------------", err);
        }
        try {
          var regex_exp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
          var email_body = text;
          var my_url = email_body.match(regex_exp);
          if (my_url !== null) userSchema["url"] = my_url[0];
          else userSchema["url"] = null;
        } catch (err) {
          console.log("error is ", err);
        }
        //Getting file ID of the assigned doc
        var url = userSchema["url"];
        //console.log(url);
        if (url === null) userSchema["file_id"] = "None";
        else {
          //getting the file id
          try {
            var start = url.match(/\/d\//);
            var end = url.match(/\/edit/);
            start["index"] += 3;
            var file_ID = url.substring(start["index"], end["index"]);
            //console.log(file_ID);
            userSchema["file_id"] = file_ID;
          } catch (err) {
            userSchema["file_id"] = false;
          }
        }

        if (url === null) userSchema["comment_id"] = null;
        else {
          try {
            var start = url.match(/disco=/);
            var end = url.match(/&ts/);
            start["index"] += 6;
            var comment_ID = url.substring(start["index"], end["index"]);
            //console.log(comment_ID);
            userSchema["comment_id"] = comment_ID;
          } catch (err) {
            console.log("error is ", err);
          }
        }
        userSchema["taskid"] = null;
        userSchema["status"] = false;
        // console.log("payload is", payload);
        var header = payload.headers;
        header.forEach((head) => {
          // console.log("head is", head);
          if (head.name === "Delivered-To") {
            userSchema["u_mail"] = head["value"];
          }
          if (head.name === "From") {
            userSchema["sender"] = head["value"];
          }
        });
        try {
          var comment_list = await window.gapi.client.drive.comments.list({
            fileId: userSchema["file_id"],
            fields: "items/status, items/content, items/commentId",
          });
          var some_data = comment_list.result["items"];
          var cmtid = userSchema["comment_id"];
          some_data.forEach(async (comments) => {
            if (comments["commentId"] === cmtid) {
              var title = comments["content"];
              if (title) {
                userSchema["task_desc"] = title;
              }
            }
          });
        } catch (err) {
          console.log("error in title fetching", err);
          userSchema["task_desc"] = null;
        }
        if (!userSchema["url"]) {
          userSchema["url"] = "#";
        }
        userData.push(userSchema);
        try {
          if (userSchema["file_id"]) {
            userSchema = await insert_task(userSchema);
            // console.log("user schema is ", userSchema);
            var GData = await GsuiteDataSave(userSchema["mid"], userSchema);
            // console.log("GData is ", GData);
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  } catch (err) {
    console.log("error is ", err);
  }
};

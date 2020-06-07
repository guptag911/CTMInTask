// import {
//     googleProvider,
//     firebaseAuth,
//     firebaseConfig,
//     db,
//   } from "../config/config";
//   import axios from "axios";
//   import { GsuiteDataSave, GsuiteDataGet, GsuiteGetId } from "./gsuiteApi";

//   export const get_msg = async (msg_ID) => {
//     try {
//       var response = await window.gapi.client.gmail.users.threads.get({
//         userId: "me",
//         id: msg_ID,
//       });
//       return response.result;
//     } catch (err) {
//       console.log("Error!", err);
//     }
//   };

//   export const fetch_data = async (query) => {
//     let mails = [];
//     let ids  = await GsuiteGetId();
//     try {
//       //list of mails fetching
//       var response = await window.gapi.client.gmail.users.messages.list({
//         userId: "me",
//         q: query,
//         maxResults: 100,
//       });
//       var messages = response.result.messages;
//       var threadList = [];
//       var userData = [];
//       //console.log("total messages are ", response.result);
//       messages.forEach(async (element) => {
//         if (ids.includes(element.threadId)) {
//           try {
//             const uid = firebaseAuth.currentUser.uid;
//             const userref = await db
//               .collection("users")
//               .doc(uid)
//               .collection("tasks")
//               .doc("gsuite")
//               .collection("data")
//               .doc(element.threadId)
//               .get();
//             var my_data = userref.data();
//             var user_schema = {};
//             // console.log("From Firebase: ",my_data);
//             //user_schema = await insert_task(my_data);
//             //   console.log("User Schema from if->", user_schema);
//             //var GData = await GsuiteDataSave(user_schema["mid"], user_schema);
//             //   console.log("Updated GData is ", GData);
//           } catch (e) {
//             console.log("Some Error has occured", e);
//           }
//         } else {
//           var userSchema = {};
//           threadList.push(element.threadId);
//           var mailData = await getIndvMail(element.threadId);
//           Mails.push(mailData);
//           userSchema["mid"] = element.threadId;
//           userSchema["date"] = mailData.internalDate;
//           var payload = mailData.payload;
//           var text;
//           //getting the url of docs
//           try {
//             var msg_raw = payload["parts"][0].body.data;
//             var data = msg_raw;
//             var buff = new Buffer.from(data, "base64");
//             text = buff.toString();
//             // console.log("---------------------------", text);
//           } catch (err) {
//             console.log("---------------------------", err);
//           }
//           try {
//             var regex_exp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
//             var email_body = text;
//             var my_url = email_body.match(regex_exp);
//             if (my_url !== null) userSchema["url"] = my_url[0];
//             else userSchema["url"] = null;
//           } catch (err) {
//             console.log("error is ", err);
//           }
//           //Getting file ID of the assigned doc
//           var url = userSchema["url"];
//           //console.log(url);
//           if (url === null) userSchema["file_id"] = "None";
//           else {
//             //getting the file id
//             try {
//               var start = url.match(/\/d\//);
//               var end = url.match(/\/edit/);
//               start["index"] += 3;
//               var file_ID = url.substring(start["index"], end["index"]);
//               //console.log(file_ID);
//               userSchema["file_id"] = file_ID;
//             } catch (err) {
//               userSchema["file_id"] = false;
//             }
//           }
  
//           if (url === null) userSchema["comment_id"] = null;
//           else {
//             try {
//               var start = url.match(/disco=/);
//               var end = url.match(/&ts/);
//               start["index"] += 6;
//               var comment_ID = url.substring(start["index"], end["index"]);
//               //console.log(comment_ID);
//               userSchema["comment_id"] = comment_ID;
//             } catch (err) {
//               console.log("error is ", err);
//             }
//           }
//           userSchema["taskid"] = null;
//           userSchema["status"] = false;
//           // console.log("payload is", payload);
//           var header = payload.headers;
//           header.forEach((head) => {
//             // console.log("head is", head);
//             if (head.name === "Delivered-To") {
//               userSchema["u_mail"] = head["value"];
//             }
//             if (head.name === "From") {
//               userSchema["sender"] = head["value"];
//             }
//           });
//           try {
//             var comment_list = await window.gapi.client.drive.comments.list({
//               fileId: userSchema["file_id"],
//               fields: "items/status, items/content, items/commentId",
//             });
//             var some_data = comment_list.result["items"];
//             var cmtid = userSchema["comment_id"];
//             some_data.forEach(async (comments) => {
//               if (comments["commentId"] === cmtid) {
//                 var title = comments["content"];
//                 if (title) {
//                   userSchema["task_desc"] = title;
//                 }
//               }
//             });
//           } catch (err) {
//             console.log("error in title fetching", err);
//             userSchema["task_desc"] = null;
//           }
//           if (!userSchema["url"]) {
//             userSchema["url"] = "#";
//           }
//           userData.push(userSchema);
//           try {
//             if (userSchema["file_id"]) {
//               userSchema = await insert_task(userSchema);
//               // console.log("Data Going to db", userSchema);
//               // console.log("user schema is ", userSchema);
//               var GData = await GsuiteDataSave(userSchema["mid"], userSchema);
//               // console.log("GData is ", GData);
//             }
//           } catch (e) {
//             console.log(e);
//           }
//         }
//       });
//     } catch (err) {
//       console.log("error is ", err);
//     }
//   };
  
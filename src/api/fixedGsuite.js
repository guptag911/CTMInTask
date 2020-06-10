// import {
//     googleProvider,
//     firebaseAuth,
//     firebaseConfig,
//     db,
//   } from "../config/config";
// import axios from "axios";
// import { GsuiteDataSave, GsuiteDataGet, GsuiteGetId } from "./gsuiteApi";

// export const get_thread = async (thread_ID) => {
//     try {
//       var response = await window.gapi.client.gmail.users.threads.get({
//         userId: "me",
//         id: thread_ID,
//       });
//       return response.result;
//     } catch (err) {
//       console.log("Error!", err);
//     }
//   };

// export const get_data = async (query) => {
//     let db_ids  = await GsuiteGetId(); //fetching thread ids from firestores
//     let user_schema = {};
//     try {
//       //fetching mails from the API
//       let response = await window.gapi.client.gmail.users.messages.list({
//         userId: "me",
//         q: query,
//         maxResults: 100,
//       });
//       let messages = response.result.messages;
//       //console.log("total messages are ", response.result);
//       messages.forEach(async (element) => {
//         let thread_ID = element.thread_ID;
//         if (db_ids.includes(thread_ID)) {
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
            
//               let my_data = userref.data();
//               //my_data['status'] = status;
//               //var GData = await GsuiteDataSave(user_schema["mid"], user_schema);
//           } catch (e) {
//             console.log("Some Error has occured", e);
//           }
//         } else {
//           let mail_data = await get_thread(thread_ID);
//           user_schema["thread_id"] = thread_ID;
//           user_schema["date"] = mail_data.internalDate;
//           let payload = mail_data.payload;
//           let text;
//           //getting the url
//           try {
//             let msg_raw = payload["parts"][0].body.data;
//             let data = msg_raw;
//             var buff = new Buffer.from(data, "base64");
//             text = buff.toString();
//           } catch (err) {
//             console.log("Email body error!", err);
//           }
//           try {
//             let regex_exp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
//             let email_body = text;
//             let my_url = email_body.match(regex_exp);
//             if (my_url !== null)
//                 user_schema["url"] = my_url[0];
//             else 
//                 user_schema["url"] = null;
//           } catch (err) {
//             console.log("error is ", err);
//           }
//           //getting the file ID
//           let url = user_schema["url"];
//           if (url === null) 
//             user_schema["file_id"] = null;
//           else {
//             try {
//               let start = url.match(/\/d\//);
//               let end = url.match(/\/edit/);
//               start["index"] += 3;
//               let file_ID = url.substring(start["index"], end["index"]);
//               //console.log(file_ID);
//               user_schema["file_id"] = file_ID;
//             } catch (err) {
//                 console.log("No file ID!", err);
//             }
//           }
//           //fetching the comment ID
//           if (url === null)
//             user_schema["comment_id"] = null;
//           else {
//             try {
//               let start = url.match(/disco=/);
//               let end = url.match(/&ts/);
//               start["index"] += 6;
//               let comment_ID = url.substring(start["index"], end["index"]);
//               //console.log(comment_ID);
//               user_schema["comment_id"] = comment_ID;
//             } catch (err) {
//               console.log("No comment ID!", err);
//             }
//           }
//           let header = payload.headers;
//           header.forEach((head) => {
//             //console.log("head is", head);
//             if (head.name === "Delivered-To") {
//               userSchema["receiver"] = head["value"];
//             }
//             if (head.name === "From") {
//               userSchema["sender"] = head["value"];
//             }
//           });
//           //getting the status
//           try {
//             let comment_list = await window.gapi.client.drive.comments.list({
//               fileId: user_schema["file_id"],
//               fields: "items/status, items/content, items/commentId",
//             });
//             let some_data = comment_list.result["items"];
//             let comment_ID = user_schema["comment_id"];
//             some_data.forEach(async (comments) => {
//               if (comments["commentId"] === comment_ID) {
//                 let title = comments["content"];
//                 if (title)
//                     user_schema["task_desc"] = title;
//                 else
//                     user_schema["task_desc"] = null;
//               }
//             });
//           } catch (err) {
//             console.log("error in title fetching", err);
//           }
//         }
//       });
//     } catch (err) {
//       console.log("error is ", err);
//     }
//   };
  
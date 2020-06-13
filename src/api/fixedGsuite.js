import {
    googleProvider,
    firebaseAuth,
    firebaseConfig,
    db,
  } from "../config/config";
  import axios from "axios";
  import { getGsuiteID, getGsuiteData, saveGsuiteData } from "./fixedDb";
  import {insert_task, update_task} from "./googleTasks";
  
  export const get_thread = async (thread_ID) => {
      try {
        var response = await window.gapi.client.gmail.users.threads.get({
          userId: "me",
          id: thread_ID,
        });
        //console.log(thread_ID,response);
        return response.result;
      } catch (err) {
        console.log("Error!", err);
      }
    };
  
  export const get_data = async (query) => {
      let db_ids  = await getGsuiteID(); //fetching thread ids from firestore
      //let user_data = [];
      try {
        //fetching mails from the API
        let response = await window.gapi.client.gmail.users.messages.list({
          userId: "me",
          q: query,
          maxResults: 100,
        });
        let messages = response.result.messages;
        //console.log("Total messages are: ", response.result.messages);
        messages.forEach(async (element) => {
            let user_schema = {};
            let thread_ID = element.threadId;
            let mail_data = await get_thread(thread_ID);
            user_schema["thread_id"] = thread_ID;
            //console.log(mail_data);
            let payload = mail_data.messages[0].payload;
            let text;
            //getting the url
            try {
              let msg_raw = payload["parts"][0].body.data;
              let data = msg_raw;
              let buff = new Buffer.from(data, "base64");
              text = buff.toString();
              //console.log(text);
            } catch (err) {
              console.log("Email body error!", err);
            }
            //fetching the url
            let urls;
            try {
              let regex_exp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
              let email_body = text;
              urls = email_body.match(regex_exp);
              //console.log(urls);
              if (urls !== null)
                  user_schema["url"] = urls[0];
              else 
                  user_schema["url"] = null;
            } catch (err) {
              console.log("error is ", err);
            }
            //getting the file ID
            let url = user_schema["url"];
            if (url === null) 
              user_schema["file_id"] = null;
            else {
              try {
                let start = url.match(/\/d\//);
                let end = url.match(/\/edit/);
                start["index"] += 3;
                let file_ID = url.substring(start["index"], end["index"]);
                //console.log(file_ID);
                user_schema["file_id"] = file_ID;
              } catch (err) {
                  console.log("No file ID!", err);
              }
            }
            let valid_urls = [];
            if(url !== null)
            {
            try
            {
              urls.forEach( (url) => {
                 let exp = new RegExp(user_schema["file_id"]);
                 let pos = url.match(exp);
                 if(pos !== null)
                  valid_urls.push(url);   
              });
            }
            catch(err)
            {
              console.log("Error!",err);
            }
           }
            //console.log(valid_urls);
            //fetching the comment IDs
            let comment_ids = new Set();
            //console.log(comment_ids);
            if(valid_urls !== null)
            {
            valid_urls.forEach( (url) => {
              try {
                  let start = url.match(/disco=/);
                  let end1 = url.match(/&ts=/);
                  let end2 = url.match(/&usp=/);
                  if(start !== null && (end1 !== null) || (end2 !== null))
                  {
                      start["index"] += 6;
                      let comment_ID = url.substring(start["index"], Math.min(end1["index"],end2["index"]));
                      comment_ids.add(comment_ID);
                  }
                  }
                  catch (err) {
                  console.log("No comment ID!", err);
                  }
              });
            }
            //console.log(comment_ids);
            let header = payload.headers;
            let sender, receiver;
            header.forEach((head) => {
              //console.log("head is", head);
              if (head.name === "Delivered-To") {
                receiver = head["value"];
              }
              if (head.name === "From") {
                sender = head["value"];
              }
            });
            //getting the status and making schema
            try
            {
            comment_ids.forEach( async (comment_ID) => {
              let schema = {};
              try {
                  let response = await window.gapi.client.drive.comments.get({
                    fileId: user_schema["file_id"],
                    commentId: comment_ID,
                  });
                  schema["status"] = response.result.status;
                  if(db_ids.includes(comment_ID))
                  {
                    //update the status in db
                    try {
                      const uid =
                        firebaseAuth.currentUser.uid === null
                          ? JSON.parse(window.sessionStorage.getItem("user")).uid
                          : firebaseAuth.currentUser.uid;
                      const useref = await db
                        .collection("users")
                        .doc(uid)
                        .collection("tasks")
                        .doc("fixed gsuite")
                        .collection("data")
                        .doc(comment_ID)
                        .get();
                      console.log(uid);
                      let my_data = useref.data();
                      my_data["status"] = schema["status"] ;
                      let db_data = await saveGsuiteData(comment_ID, my_data);
                    } catch (e) {
                      console.log("Error is", e);
                    }
                  }
                  else {
                  let task_desc = response.result.content;
                  //save in db
                  schema["thread_id"] = thread_ID;
                  schema["file_id"] = user_schema["file_id"];
                  schema["comment_id"] = comment_ID;
                  schema["sender"] = sender;
                  schema["receiver"] = receiver;
                  schema["url"] = url;
                  schema["task_desc"] = task_desc;
                  console.log(schema);
                  let db_data = await saveGsuiteData(comment_ID, schema);
                  }
                } catch (err) {
                  console.log("no comment ID", err);
                  }   
            });
            }
            catch(err)
            {
              console.log("Error!",err);
            } 
        })
      } catch (err) {
        console.log("error is ", err);
      }
    };
setTimeout(() => {
  get_data("from: comments-noreply@docs.google.com");
},3000);


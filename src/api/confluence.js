import {
  googleProvider,
  firebaseAuth,
  firebaseConfig,
  db,
} from "../config/config";
import * as conf from "../helper/confAuth";
import * as userConf from "../helper/confUserAuth";
import axios from "axios";
import { save_confluenceData, get_confluenceData , get_confluenceID } from "./atlassian";
const cheerio = require('cheerio');

/*
user_schema = {
  content_id:
  task_id:
  status: 
  page_title:
  space_name: 
  url: 
  due_date: if given else null
  task_name:
}
*/

async function content(content_id) {
  const apiPath = "rest/api/content/" + String(content_id);
  const reqUrl = await conf.constrRequestUrl(apiPath);
  const token = await conf.getToken();
  const result = await axios.get(reqUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  //console.log(result.data);
  return result.data;
}


async function task(account_id) {
  try {
    const apiPath = "rest/api/inlinetasks/search?assignee=" + account_id;
    const reqUrl = await conf.constrRequestUrl(apiPath);
    const token = await conf.getToken();
    const result = await axios.get(reqUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return result.data.results;
  }
  catch (err) {
    console.log('Error!', err);
  }
}

async function user() {
  try {
    const apiPath = "https://api.atlassian.com/me";
    const token = await userConf.getUserToken();
    const result = await axios.get(apiPath, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return result.data.account_id;
  }
  catch (err) {
    console.log('Error!', err);
  }
}

async function get_date(timestamp) {
  let timestamp_ms = timestamp;
  let date_obj = new Date(timestamp_ms);
  let year = date_obj.getFullYear();
  year = year.toString();
  let month = ("0" + (date_obj.getMonth() + 1)).slice(-2);
  month = month.toString();
  let day = ("0" + date_obj.getDate()).slice(-2);
  day = day.toString();
  //Getting the due date
  let date = day + '-' + month + '-' + year;
  return date;
}

async function get_data() {
  let user_schema = {};
  try {
    let account_ID = await user();
    let tasklist = await task(account_ID);
    console.log(tasklist);
    tasklist.forEach(async (element) => {
      let content_ID = element.contentId;
      let task_ID  = String(content_ID)+String(element.id);
      let status = element.status;
      //fetching task ids from firestore
      let db_ids = await get_confluenceID();
      if(db_ids.includes(task_ID))
      {
        //change the status accordingly
        try
        {
          const uid = firebaseAuth.currentUser.uid;
          const useref = await db
          .collection("users")
          .doc(uid)
          .collection("tasks")
          .doc("atlassian")
          .collection("confluence")
          .doc(task_ID)
          .get();

          let my_data = useref.data();
          my_data["status"] = status;
        }
        catch(err)
        {
          console.log("error!",err);
        }
      }
      else
      {
      let data = await content(content_ID);
      //making user schema
      user_schema['content_id'] = content_ID;
      user_schema['task_id'] = task_ID;
      user_schema['status'] = status;
      user_schema['page_title'] = data.title;
      user_schema['space_name'] = data.space.name;
      user_schema['url'] = "https://innovaccer.atlassian.net/wiki" + data._links.webui;
      user_schema['due_date'] = null;
      if (element.dueDate)
        user_schema['due_date'] = await get_date(element.dueDate);
      //fetching the task description
      let body = element.body;
      const $ = cheerio.load(body);
      let task_name = $('span[class=placeholder-inline-tasks]').text();
      if (user_schema['due_date'] !== null)
        task_name += user_schema['due_date'];
      user_schema['task_name'] = task_name;
      console.log(user_schema);
      //saving the data
      let db_data =  await save_confluenceData(user_schema["task_id"], user_schema);
      }
    });
  }
  catch (err) {
    console.log('Error!', err);
  }
}

//get_data();
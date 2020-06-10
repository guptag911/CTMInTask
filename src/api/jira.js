/* eslint-disable no-unused-expressions */
import axios from "axios";
import * as jira from "../helper/jiraAuth";
import {
  googleProvider,
  firebaseAuth,
  firebaseConfig,
  db,
} from "../config/config";
import { get_JiraID, get_JiraData, save_JiraData } from "./atlassian";

/*
user_schema = {
  issue_id:
  project_name: 
  project_type: software or business
  url: url of the project
  issue_name:
  status: complete or incomplete
  due_date: null if not given
  priority: low, high, medium etc
  issue_type: bug, task etc  
}
*/

async function issues(account_ID) {
  try {
    const apiPath = "rest/api/3/search?jql=assignee=" + account_ID;
    const reqUrl = await jira.constrRequestUrl(apiPath);
    const token = await jira.getJiraToken();
    const result = await axios.get(reqUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    //console.log(result.data);
    return result.data.issues;
  } catch (err) {
    console.log("Error is:", err);
  }
}

async function user() {
  try {
    const apiPath = "https://api.atlassian.com/me";
    const token = JSON.parse(localStorage.getItem("user")).access_token;
    const result = await axios.get(apiPath, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    console.log(result.data);
    return result.data.account_id;
  } catch (err) {
    console.log("Error!", err);
  }
}

async function issues_data() {
  let user_schema = {};
  try {
    let account_ID = await user();
    console.log(account_ID);
    let issues_list = await issues(account_ID);
    console.log(issues_list);
    issues_list
      ? issues_list.forEach(async (element) => {
          let issue_ID = element.id;
          let fields_list = element.fields;
          let status = fields_list.resolution;
          let issue_key = element.key;
          if (status == null) status = "incomplete";
          else status = "complete";
          //fetching issue ids from firestore
          let db_ids = await get_JiraID();
          if (db_ids.includes(issue_ID)) {
            //change the status accordingly

            try {
              const uid =
                firebaseAuth.currentUser.uid === null
                  ? JSON.parse(window.sessionStorage.getItem("user")).uid
                  : firebaseAuth.currentUser.uid;
              console.log(uid);
              const useref = await db
                .collection("users")
                .doc(uid)
                .collection("tasks")
                .doc("atlassian")
                .collection("jira")
                .doc(issue_ID)
                .get();
                
              let my_data = useref.data();
              my_data["status"] = status;

              let db_data = await save_JiraData(issue_ID,my_data);
            } catch (err) {
              console.log("error!", err);
            }
          } else {
            user_schema["issue_id"] = issue_ID;
            user_schema["project_name"] = fields_list.project.name;
            user_schema["project_type"] = fields_list.project.projectTypeKey;
            let project_key = fields_list.project.key;
            let url = `https://innovaccer.atlassian.net/jira/${user_schema.project_type}/projects/${project_key}/issues/${issue_key}`;
            user_schema["url"] = url;
            user_schema["issue_name"] = fields_list.summary;
            user_schema["due_date"] = fields_list.duedate;
            user_schema["status"] = status;
            user_schema["priority"] = fields_list.priority.name;
            user_schema["issue_type"] = fields_list.issuetype.name;

            console.log(user_schema);
            //saving the data
            let db_data = await save_JiraData(
              user_schema["issue_id"],
              user_schema
            );
          }
        })
      : null;
  } catch (err) {
    console.log("Error is:", err);
  }
}

if (
  window.localStorage.getItem("user") &&
  window.localStorage.getItem("jira")
) {
  issues_data();
}

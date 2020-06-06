import axios from "axios";
import * as jira from "../helper/jiraAuth";
import {
    googleProvider,
    firebaseAuth,
    firebaseConfig,
    db,
  } from "../config/config";

async function issues(account_ID) {
    try{
    const apiPath = 'rest/api/3/search?jql=assignee='+account_ID;
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
  }
  catch(err)
  {
      console.log("Error is:",err);
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

async function subtasks_data (subtasks_list) {
    let subtask = [];
    try
    {
      subtasks_list.forEach(async (element) => {
      let sub_schema = {}; 
      sub_schema['subtask_ID'] = element.id;
      let fields_list = element.fields;
      sub_schema['subtask_name'] = fields_list.summary;
      sub_schema['due_date'] = fields_list.duedate;
      sub_schema['status'] = fields_list.status.name;
      sub_schema['priority'] = fields_list.priority.name;
      sub_schema['assigned_by'] = fields_list.creator.displayName;
      subtask.push(sub_schema);
      });
      return subtask;      
    }
    catch(err)
    {
      console.log("Error is:",err);
    }
} 

async function issues_data () {
    let account_ID = await user();
    //console.log(account_ID);
    let issues_list = await issues(account_ID);
    //console.log(issues_list);
    let user_schema = {};
    try
    {
    issues_list.forEach(async (element) => {
        let issue_ID = element.id;
        user_schema['issue_id'] = issue_ID;
        let fields_list = element.fields;
        user_schema['project_name'] = fields_list.project.name;
        let project_key = fields_list.project.key;
        let url = 'https://innovaccer.atlassian.net/browse/'+project_key;
        user_schema['url'] = url;
        user_schema['issue_name'] = fields_list.summary;
        user_schema['due_date'] = fields_list.duedate;
        user_schema['status'] = fields_list.status.name;
        user_schema['priority'] = fields_list.priority.name;
        user_schema['assigned_by'] = fields_list.creator.displayName;
        let subtasks_list = fields_list.subtasks;
        //console.log(subtasks_list);
        });
    }
    catch(err)
    {
       console.log("Error is:",err);
    }
}

issues_data();
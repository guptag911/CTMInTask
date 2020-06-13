import {
    googleProvider,
    firebaseAuth,
    firebaseConfig,
    db,
  } from "../config/config";
import axios from "axios";

export const insert_task = async (task_desc,url) => {
    let body = {
        title: task_desc,
        notes: url
    }
    try
    {
    let response = await window.gapi.client.tasks.tasks.insert({
        tasklist: "@default",
        resource: body
    });
    let task_info = {
        task_id: response.items.id,
        task_status: response.items.status
    }
    return task_info; //use this info to update in db
    }
    catch(err)
    {
        console.log("Error in inserting task! ",err);
    }
} 

export const update_task = async (schema) => {
    let task_status;
    if(schema["status"] === open)
        task_status = "needsAction";
    else
        task_status = "completed"
    let body = {
        status: task_status
    }
    try
    {
    let response = await window.gapi.client.tasks.tasks.update({
        tasklist: "@default",
        task: schema["task_id"],
        resource: body
    });
    }
    catch(err)
    {
        console.log("Error in updating task! ",err);
    }
} 
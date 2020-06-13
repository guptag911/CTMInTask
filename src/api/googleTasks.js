import {
    googleProvider,
    firebaseAuth,
    firebaseConfig,
    db,
  } from "../config/config";
import axios from "axios";

export const get_tasks = async () => {
    try
    {
    let response = await window.gapi.client.tasks.tasks.list({
        tasklist: "@default"
    });
    let tasks_list = response.result.items;
    console.log(tasks_list);
    let task_ids = [];
    tasks_list.forEach(element => {
        task_ids.push(element.id);
    });
    return task_ids;
    }
    catch(err)
    {
        console.log("Error in getting tasks! ",err);
    }
}

export const delete_tasks = async () => {
    let tasks_ids = await get_tasks();
    tasks_ids.forEach(task_id => {
    try
    {
        let response = await window.gapi.client.tasks.tasks.delete({
            tasklist: "@default",
            task: task_id
        });
    }
    catch(err)
    {
        console.log("Error in deleting task! ",err);
    } 
    });
}

export const insert_tasks = async () => {
    let task_data = await open_tasks();
    let body = {
        title: task_data["task_desc"],
        notes: task_data["url"]
    }
    try
    {
    let response = await window.gapi.client.tasks.tasks.insert({
        tasklist: "@default",
        resource: body
    });
    }
    catch(err)
    {
        console.log("Error in inserting tasks! ",err);
    }
}

export const open_tasks = async () => {
    try {
        const uid = firebaseAuth.currentUser.uid === null
            ? JSON.parse(window.sessionStorage.getItem("user")).uid
            : firebaseAuth.currentUser.uid;
        const userRef = await db
          .collection("users")
          .doc(uid)
          .collection("tasks")
          .doc("fixed gsuite")
          .collection("data")
          .where("status", "==", open)
          .get();
        let final_data = [];
        userRef.forEach((data) => {
          final_data.push(data.data());
        });
        // console.log("Data is ", finalData);
        return final_data;
      } 
      catch (err) 
      {
        console.log("Error in reading tasks! ", err);
        return [];
      }
}

get_tasks();

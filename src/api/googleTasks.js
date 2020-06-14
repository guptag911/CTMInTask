import { firebaseAuth, db } from "../config/config";
import { get_tasklists } from "./newTasklist";

export const get_tasks = async (tasklist_id) => {
  try {
    let response = await window.gapi.client.tasks.tasks.list({
      tasklist: tasklist_id,
    });
    let tasks_list = response.result.items;
    let task_ids = [];
    tasks_list.forEach((element) => {
      task_ids.push(element.id);
    });
    return task_ids;
  } catch (err) {
    console.log("Error in getting tasks! ", err);
  }
};

export const delete_tasks = async (tasklist_id) => {
  try {
    let tasks_ids = await get_tasks();
    tasks_ids.forEach(async (task_id) => {
      try {
        let response = await window.gapi.client.tasks.tasks.delete({
          tasklist: tasklist_id,
          task: task_id,
        });
      } catch (err) {
        console.log("Error in deleting task! ", err);
      }
    });
  } catch (err) {
    console.log("undefined", err);
  }
};

export const insert_tasks = async (tasklist_id) => {
  let task_data = await open_tasks();
  try {
    task_data.forEach(async (task) => {
      let body = {
        title: task.task_desc,
        notes: task.url,
      };
      try {
        let response = await window.gapi.client.tasks.tasks.insert({
          tasklist: tasklist_id,
          resource: body,
        });
        console.log(response);
      } catch (err) {
        console.log("Error in inserting tasks! ", err);
      }
    });
  } catch (err) {
    console.log("task_data undefined", err);
  }
};

export const open_tasks = async () => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("gsuite")
      .collection("data")
      .where("status", "==", "open")
      .get();
    let final_data = [];
    userRef.forEach((data) => {
      final_data.push(data.data());
    });
    // console.log("Data is ", finalData);
    return final_data;
  } catch (err) {
    console.log("Error in reading tasks! ", err);
    return [];
  }
};

//let tasklist_id = get_tasklists();
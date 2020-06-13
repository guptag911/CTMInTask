import {
  googleProvider,
  firebaseAuth,
  firebaseConfig,
  db,
} from "../config/config";
import axios from "axios";

export const insert_task = async (task_desc, url) => {
  let body = {
    title: task_desc.toString(),
    notes: url.toString(),
  };
  try {
    let response = await window.gapi.client.tasks.tasks.insert({
      tasklist: "@default",
      resource: body,
    });
    console.log(response);
    let task_info = {
      task_id: response.result.id,
      task_status: response.result.status,
    };
    return task_info; //use this info to update in db
  } catch (err) {
    console.log("Error in inserting task! ", err);
  }
};

export const update_task = async (schema) => {
  let task = await window.gapi.client.tasks.tasks.get({
    tasklist: "@default",
    task: schema.task_id,
  });

  if (schema["status"] === "open") task.result.status = "needsAction";
  else {
    task.result.status = "completed";
    task.result.hidden = true;
  }

  console.log(typeof schema.task_id, typeof schema, task.result);
  try {
    let response = await window.gapi.client.tasks.tasks.update(
      {
        tasklist: "@default",
        task: schema.task_id,
      },
      task.result
    );
    console.log(response);
  } catch (err) {
    console.log("Error in updating task! ", err);
  }
};

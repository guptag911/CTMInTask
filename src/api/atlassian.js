import { firebaseAuth, db } from "../config/config";

export const save_confluenceData = async (task_id, userdata) => {
  try {
    // console.log("CURRENT USER IS ", firebaseAuth.currentUser.uid);
    // console.log("In atlassian function confluence data is ", userdata);
    userdata["upload_time_utc"] = Date.now();
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("atlassian")
      .collection("confluence")
      .doc(task_id)
      .update(userdata);

    // console.log("userRef is:", userRef);
    // console.log("In atlassian function confluence data is ", userdata);
    return { msg: "success" };
  } catch (err) {
    console.log("Error is:", err);
    return { msg: "fail" };
  }
};

export const get_confluenceData = async () => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("atlassian")
      .collection("confluence")
      .get();
    var finalData = [];
    userRef.forEach((data) => {
      finalData.push(data.data());
    });
    // console.log("Data is:", finalData);
    return finalData;
  } catch (err) {
    // console.log(JSON.parse(window.sessionStorage.getItem("user")).uid);
    console.log("Error is:", err);
    return [];
  }
};

export const get_confluenceID = async () => {
  try {
    var my_data = await get_confluenceData();
    var task_ids = [];
    (await my_data).forEach((data) => {
      task_ids.push(data["task_id"]);
    });
    //console.log("IDs are:", task_ids);
    return task_ids;
  } catch (err) {
    console.log("Error is:", err);
    return [];
  }
};

export const getConfluenceDataStatusIncomplete = async () => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("atlassian")
      .collection("confluence")
      .where("status", "==", "incomplete")
      .get();
    var finalData = [];
    userRef.forEach((data) => {
      finalData.push(data.data());
    });
    // console.log("Data is:", finalData);
    return finalData;
  } catch (err) {
    // console.log(JSON.parse(window.sessionStorage.getItem("user")).uid);
    console.log("Error is:", err);
    return [];
  }
};

export const save_JiraData = async (issue_id, userdata) => {
  try {
    //console.log("CURRENT USER IS ", firebaseAuth.currentUser.uid);
    //console.log("In atlassian function");
    userdata["upload_time_utc"] = Date.now();
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("atlassian")
      .collection("jira")
      .doc(issue_id)
      .update(userdata);
    //console.log("userRef is:", userRef);
    // console.log("In atlassian function Jira data is ", userdata);

    return { msg: "success" };
  } catch (err) {
    console.log("Error is:", err);
    return { msg: "fail" };
  }
};

export const get_JiraData = async () => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("atlassian")
      .collection("jira")
      .get();
    var finalData = [];
    userRef.forEach((data) => {
      finalData.push(data.data());
    });
    // console.log("Data is:", finalData);
    return finalData;
  } catch (err) {
    // console.log(JSON.parse(window.sessionStorage.getItem("user")).uid);
    console.log("Error is:", err);
    return [];
  }
};

export const get_JiraID = async () => {
  try {
    var my_data = await get_JiraData();
    var issue_ids = [];
    my_data.forEach((data) => {
      issue_ids.push(data["issue_id"]);
    });
    //console.log("IDs are:", task_ids);
    return issue_ids;
  } catch (err) {
    console.log("Error is:", err);
    return [];
  }
};

export const getJiraDataStatusIncomplete = async () => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("atlassian")
      .collection("jira")
      .where("status", "==", "incomplete")
      .get();
    let finalData = [];
    userRef.forEach((data) => {
      finalData.push(data.data());
    });
    return finalData;
  } catch (err) {
    console.log("Error is:", err);
    return [];
  }
};

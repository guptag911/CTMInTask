import { firebaseAuth, db } from "../config/config";

export const getStarGsuiteData = async () => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection("gsuite")
      .get();
    let finalData = [];
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


export const saveStarGsuiteData = async (service,userdata) => {
  try {
    userdata["upload_time_utc"] = Date.now();
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection(service)
      .doc(userdata.comment_id)
      .set(userdata);

    return { msg: "success" };
  } catch (err) {
    console.log("Error is:", err);
    return { msg: "fail" };
  }
};



export const deleteStarGsuiteData = async (service,userdata) => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection(service)
      .doc(userdata.comment_id)
      .delete();

    return { msg: "success" };
  } catch (err) {
    console.log("Error is:", err);
    return { msg: "fail" };
  }
};


export const getStarJiraData = async () => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection("jira")
      .get();
    let finalData = [];
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



export const saveStarJiraData = async (service,userdata) => {
  try {
    userdata["upload_time_utc"] = Date.now();
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection(service)
      .doc(userdata.issue_id)
      .set(userdata);

    return { msg: "success" };
  } catch (err) {
    console.log("Error is:", err);
    return { msg: "fail" };
  }
};



export const deleteStarJiraData = async (service,issue_id) => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection(service)
      .doc(issue_id)
      .delete();

    return { msg: "success" };
  } catch (err) {
    console.log("Error is:", err);
    return { msg: "fail" };
  }
};



export const getStarConfluenceData = async () => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection("confluence")
      .get();
    let finalData = [];
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



export const saveStarConfluenceData = async (service,userdata) => {
  try {
    userdata["upload_time_utc"] = Date.now();
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection(service)
      .doc(userdata.task_id)
      .set(userdata);

    return { msg: "success" };
  } catch (err) {
    console.log("Error is:", err);
    return { msg: "fail" };
  }
};



export const deleteStarConfluenceData = async (service,task_id) => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection(service)
      .doc(task_id)
      .delete();

    return { msg: "success" };
  } catch (err) {
    console.log("Error is:", err);
    return { msg: "fail" };
  }
};




export const getStarHubspotData = async () => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection("hubspot")
      .get();
    let finalData = [];
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



export const saveStarHubspotData = async (service,userdata) => {
  try {
    userdata["upload_time_utc"] = Date.now();
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection(service)
      .doc(userdata.engagement.id.toString())
      .set(userdata);

    return { msg: "success" };
  } catch (err) {
    console.log("Error is:", err);
    return { msg: "fail" };
  }
};



export const deleteStarHubspotData = async (service, engagement_id) => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("star")
      .collection(service)
      .doc(engagement_id)
      .delete();

    return { msg: "success" };
  } catch (err) {
    console.log("Error is:", err);
    return { msg: "fail" };
  }
};

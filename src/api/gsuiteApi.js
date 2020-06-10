import { firebaseAuth, db } from "../config/config";

var MY_SCHEMA = {
  mid: "Contains the message id/thread id",
  u_mail: "bittu.ray@innovaccer.com",
  date: "Assignment Date",
  sender: "bittukumar.r17@iiits.in",
  url: "https://www.facebook.com",
  file_id: "FileId of the doc",
  comment_id: "Comment ID will be UNIQUE",
  taskid: "task_id",
  status: true,
};

export const GsuiteDataSave = async (mid, userdata) => {
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
      .doc("gsuite")
      .collection("data")
      .doc(mid)
      .set(userdata);
    // console.log("userRef is ", userRef);
    return { msg: "success" };
  } catch (e) {
    console.log(window.sessionStorage.getItem("user"));
    console.log("error is ", e);
    return { msg: "fail" };
  }
};

export const GsuiteDataGet = async () => {
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
      .get();
    var finalData = [];
    userRef.forEach((data) => {
      finalData.push(data.data());
    });
    return finalData;
  } catch (e) {
    console.log(window.sessionStorage.getItem("user"));
    console.log("error is ", e);
    return [];
  }
};

export const GsuiteGetId = async () => {
  try {
    var my_data = GsuiteDataGet();
    var ids = [];
    (await my_data).forEach((data) => {
      ids.push(data["mid"]);
    });
    //console.log("ids are->", ids)
    return ids;
  } catch (e) {
    console.log("Error is", e);
    return [];
  }
};

export const GsuiteDataSaveReply = async (tid, userdata) => {


  const subjectList = userdata.subject.toLowerCase().split(" ");
  let subjectDict = {};
  for (let subject in subjectList) {
    subjectDict[subjectList[subject]] = 1;
  }

  const CalWords = {"anniversary":"anniversary" ,"invitation": "invitation:", "feedback": "feedback", "townhall": "townhall","town_hall":"town hall","wishing":"wishing" };

  if (!((subjectDict[CalWords.invitation]) || (subjectDict[CalWords.townhall] && !(subjectDict[CalWords.feedback])) || (subjectDict[CalWords.town_hall])|| (subjectDict[CalWords.wishing])|| (subjectDict[CalWords.anniversary]))) {

    try {
      // console.log("CURRENT USER IS ", firebaseAuth.currentUser.uid);
      // console.log("In gsuite funct");
      userdata["upload_time_utc"] = Date.now();
      const uid =
        firebaseAuth.currentUser.uid === null
          ? JSON.parse(window.sessionStorage.getItem("user")).uid
          : firebaseAuth.currentUser.uid;

      // userdata.sender.split("<")[1] ? userdata.sender.split("<")[1].split(">")[0] : userdata.sender

      userdata.sender = userdata.sender.split("<")[1] ? userdata.sender.split("<")[1].split(">")[0] : userdata.sender;
      const userRef = await db
        .collection("users")
        .doc(uid)
        .collection("tasks")
        .doc("gsuite")
        .collection("reply")
        .doc(tid)
        .set(userdata);
      // console.log("userRef is ", userRef);
      return { msg: "success" };
    } catch (e) {
      console.log(window.sessionStorage.getItem("user"));
      console.log("error is ", e);
      return { msg: "fail" };
    }
  }
};

export const GsuiteDataGetReply = async () => {
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
      .collection("reply")
      .get();
    var finalData = [];
    userRef.forEach((data) => {
      finalData.push(data.data());
    });
    // console.log("Data is ", finalData);
    return finalData;
  } catch (e) {
    console.log("error is ", e);
    return [];
  }
};

export const GsuiteGetIdreply = async () => {
  try {
    var my_data = GsuiteDataGetReply();
    var ids = [];
    (await my_data).forEach((data) => {
      ids.push(data["tid"]);
    });
    //console.log("ids are->", ids)
    return ids;
  } catch (e) {
    console.log("Error is", e);
    return [];
  }
};

export const GsuiteDataGetReplyFalse = async () => {
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
      .collection("reply")
      .where("replied", "==", false)
      .get();
    var finalData = [];
    userRef.forEach((data) => {
      finalData.push(data.data());
    });
    // console.log("Data is ", finalData);
    return finalData;
  } catch (e) {
    console.log("error is ", e);
    return [];
  }
};



export const GmailReplyUpdateData = async (tid, userdata) => {
  try {
    userdata["upload_time_utc"] = Date.now();
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
        console.log("data ----- ", userdata);
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("gsuite")
      .collection("reply")
      .doc(tid)
      .set(userdata);
    // console.log("userRef is ", userRef);
    return { msg: "success" };
  } catch (e) {
    console.log(window.sessionStorage.getItem("user"));
    console.log("error is ", e);
    return { msg: "fail" };
  }
};

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
      .delete();

    return { msg: "success" };
  } catch (err) {
    console.log("Error is:", err);
    return { msg: "fail" };
  }
};

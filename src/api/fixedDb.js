import { firebaseAuth, db } from "../config/config";

export const getGsuiteData = async () => {
    try {
      const uid =
        firebaseAuth.currentUser.uid === null
          ? JSON.parse(window.sessionStorage.getItem("user")).uid
          : firebaseAuth.currentUser.uid;
      const userRef = await db
        .collection("users")
        .doc(uid)
        .collection("tasks")
        .doc("fixed gsuite")
        .collection("data")
        .get();
      var finalData = [];
      userRef.forEach((data) => {
        finalData.push(data.data());
      });
      // console.log("Data is:", finalData);
      return finalData;
    } catch (err) {
      console.log(JSON.parse(window.sessionStorage.getItem("user")).uid);
      console.log("Error is:", err);
      return [];
    }
  };

export const getGsuiteID = async () => {
    try {
      var my_data = await getGsuiteData();
      var comment_ids = [];
      (await my_data).forEach((data) => {
        comment_ids.push(data["comment_id"]);
      });
      //console.log("IDs are:", task_ids);
      return comment_ids;
    } catch (err) {
      console.log("Error is:", err);
      return [];
    }
  };

  export const saveGsuiteData = async (comment_id, userdata) => {
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
        .doc("fixed gsuite")
        .collection("data")
        .doc(comment_id)
        .set(userdata);
  
      // console.log("userRef is:", userRef);
      // console.log("In atlassian function confluence data is ", userdata);
      return { msg: "success" };
    } catch (err) {
      console.log("Error is:", err);
      return { msg: "fail" };
    }
  };
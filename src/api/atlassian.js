import { firebaseAuth, db } from "../config/config";


export const save_confluenceData = async (task_id, userdata) => {
    try {
      // console.log("CURRENT USER IS ", firebaseAuth.currentUser.uid);
      // console.log("In atlassian function");
      userdata["upload_time_utc"] = Date.now();
      const uid = firebaseAuth.currentUser.uid;
      const userRef = await db
        .collection("users")
        .doc(uid)
        .collection("tasks")
        .doc("atlassian")
        .collection("confluence")
        .doc(task_id)
        .set(userdata);
      // console.log("userRef is:", userRef);
      return { msg: "success" };
    } 
    catch (err)
    {
      console.log("Error is:", err);
      return { msg: "fail" };
    }
  };

export const get_confluenceData = async () => {
    try {
      const uid = firebaseAuth.currentUser.uid;
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
    } 
    catch (err)
    {
      console.log("Error is:", err);
      return [];
    }
  };

export const get_confluenceID = async () => {
    try {
      var my_data = get_confluenceData();
      var task_ids = [];
      (await my_data).forEach((data) => {
        task_ids.push(data['task_id']);
      });
      //console.log("IDs are:", task_ids);
      return task_ids;
    }
    catch (err)
    {
      console.log("Error is:", err);
      return [];
    }
  };
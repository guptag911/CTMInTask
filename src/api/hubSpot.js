import axios from "axios";
import * as hub from "../helper/hubAuth";
import { firebaseAuth, db } from "../config/config";

const proxyurl = "https://cors-anywhere.herokuapp.com/";

export const GetContactId = async () => {
  try {
    const HubToken = await hub.getHubToken();
    // console.log("token is ", HubToken);
    const result = await axios.get(
      proxyurl +
      `https://api.hubapi.com/contacts/v1/search/query?q=${firebaseAuth.currentUser.email}`,
      { headers: { Authorization: `Bearer ${HubToken}` } }
    );

    // console.log("contact is ", result);

    return result.data.total
      ? [result.data.contacts[0].vid, result.data.contacts[0]["profile-url"]]
      : [-1, -1]; //-1 is for error or no data
  } catch (e) {
    console.log("error is ", e);
    return -1;
  }
};


export const HubSpotTasksGetAPIData = async () => {
  try {
    const contactId = await GetContactId();
    // console.log("contact id is ", contactId);
    if (contactId[0] !== -1) {
      const HubToken = await hub.getHubToken();
      let hasmore = true;
      let offset = 0;
      let result;
      while (hasmore) {
        const result = await axios.get(
          proxyurl +
          `https://api.hubapi.com/engagements/v1/engagements/associated/CONTACT/${contactId[0]}/paged?offset=${offset}`,
          { headers: { Authorization: `Bearer ${HubToken}` } }
        );
        result.data.results["url"] = contactId[1];

        // console.log("result data is ", result.data);
        // console.log(result.data);
        const data = await HubSpotDataSave(result.data.results);
        hasmore = result.data.hasMore;
        offset = result.data.offset;
      }
    }
  } catch (e) {
    console.log("error in Hubspot data getting saving api from hubspot.com");
  }
};

export const HubSpotDataSave = async (userdata) => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    for (let data = 0; data < userdata.length; data++) {
      userdata[data]["upload_time_utc"] = Date.now();
      const userRef = await db
        .collection("users")
        .doc(uid)
        .collection("tasks")
        .doc("hubspot")
        .collection("data")
        .doc(userdata[data].engagement.id.toString())
        .set(userdata[data]);
    }
    return { msg: "success" };
  } catch (e) {
    console.log("error is -----", e);
    return { msg: "fail" };
  }
};

export const HubSpotDataGet = async () => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("hubspot")
      .collection("data")
      .get();
    var finalData = [];
    userRef.forEach((data) => {
      finalData.push(data.data());
    });
    return finalData;
  } catch (e) {
    console.log("error is ", e);
    return [];
  }
};


export const HubSpotSingleDataSave = async (userdata) => {
  try {
    const uid =
      firebaseAuth.currentUser.uid === null
        ? JSON.parse(window.sessionStorage.getItem("user")).uid
        : firebaseAuth.currentUser.uid;
    userdata["upload_time_utc"] = Date.now();
    const userRef = await db
      .collection("users")
      .doc(uid)
      .collection("tasks")
      .doc("hubspot")
      .collection("data")
      .doc(userdata.engagement.id.toString())
      .set(userdata);
    return { msg: "success" };
  } catch (e) {
    console.log("error is -----", e);
    return { msg: "fail" };
  }
};
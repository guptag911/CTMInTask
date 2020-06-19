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
      let offset = false;
      let result;
      while (hasmore) {
        if (!offset) {
          const result = await axios.get(
            proxyurl +
            `https://api.hubapi.com/engagements/v1/engagements/associated/CONTACT/${contactId[0]}/paged`,
            { headers: { Authorization: `Bearer ${HubToken}` } }
          );
          result.data.results["url"] = contactId[1];

          // console.log("result data is ", result.data);
          console.log(result.data);
          const data = await HubSpotDataSave(result.data.results);
          hasmore = result.data.hasMore;
          offset = result.data.offset;

        }
        else {
          const result = await axios.get(
            proxyurl +
            `https://api.hubapi.com/engagements/v1/engagements/associated/CONTACT/${contactId[0]}/paged&offset=${offset}`,
            { headers: { Authorization: `Bearer ${HubToken}` } }
          );

          result.data.results["url"] = contactId[1];

          // console.log("result data is ", result.data);
          console.log(result.data);
          hasmore = result.data.hasMore;
          offset = result.data.offset;
          const data = await HubSpotDataSave(result.data.results);

        }

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
    const url = userdata.url;
    console.log(url, uid);
    for (let data = 0; data < userdata.length; data++) {
      const userRef = await db
        .collection("users")
        .doc(uid)
        .collection("tasks")
        .doc("hubspot")
        .collection("data")
        .doc(userdata[data].engagement.id.toString())
        .set({
          engagement: userdata[data].engagement,
          associations: userdata[data].associations,
          metadata: userdata[data].metadata,
          url: url,
          upload_time_utc: Date.now(),
        });
      // console.log("userRef is ", userRef);
    }
    return { msg: "success" };
  } catch (e) {
    console.log(window.sessionStorage.getItem("user"));
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
    console.log(window.sessionStorage.getItem("user"));
    console.log("error is ", e);
    return [];
  }
};

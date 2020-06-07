import axios from "axios";
import * as hub from "../helper/hubAuth";
import { firebaseAuth } from "../config/config";

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

export const HubSpotTasksGet = async () => {
  try {
    const contactId = await GetContactId();
    // console.log("contact id is ", contactId);
    if (contactId[0] != -1) {
      const HubToken = await hub.getHubToken();
      const result = await axios.get(
        proxyurl +
          `https://api.hubapi.com/engagements/v1/engagements/associated/CONTACT/${contactId[0]}/paged`,
        { headers: { Authorization: `Bearer ${HubToken}` } }
      );
      console.log("result data is ", result.data);
      result.data.results["url"] = contactId[1];
      return result.data.results;
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
};

import axios from "axios";
import * as z from "../helper/zohoAuth";
import { firebaseAuth, db } from "../config/config";

const proxyurl = "https://cors-anywhere.herokuapp.com/";

export async function authToken() {
  const token = await z.getZohoToken();
  console.log(token);
  const result = await axios.get(
    proxyurl +
      "https://people.zoho.com/people/api/forms/employee/getRecords?sIndex=1&limit=100",
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        Accept: "application/json",
      },
    }
  );

  console.log(result.data);
}

authToken();

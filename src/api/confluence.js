import * as conf from "../helper/confAuth";
import axios from "axios";
const apiPath = "rest/api/space";

async function apiConf() {
  const reqUrl = await conf.constrRequestUrl(apiPath);
  console.log(reqUrl);
  const token = JSON.parse(localStorage.getItem("token"));
  const result = await axios.get(reqUrl, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      Accept: "application/json",
    },
  });
  console.log(result.data);
}


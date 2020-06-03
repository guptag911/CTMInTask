import * as conf from "../helper/confAuth";
import * as userConf from "../helper/confUserAuth";
import axios from "axios";

async function space() {
  const apiPath = "rest/api/content";
  const reqUrl = await conf.constrRequestUrl(apiPath);
  const token = await conf.getToken();
  const result = await axios.get(reqUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  console.log(result.data);
  return result.data;
}


async function task() {
  const apiPath = "rest/api/inlinetasks/search?limit=10";
  const reqUrl = await conf.constrRequestUrl(apiPath);
  const token = await conf.getToken();
  const result = await axios.get(reqUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  console.log(result.data);
}

async function user() {
  const apiPath = "https://api.atlassian.com/me";
  const token = await userConf.getUserToken();
  const result = await axios.get(apiPath, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  console.log(result.data);
  return result.data;
}

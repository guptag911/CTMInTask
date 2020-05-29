import * as conf from "../helper/confAuth";
import axios from "axios";

async function space() {
  const apiPath = "rest/api/space";
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

space();

async function task() {
  const apiPath = "rest/api/inlinetasks/search";
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

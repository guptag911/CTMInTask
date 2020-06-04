import * as conf from "../helper/confAuth";
import * as userConf from "../helper/confUserAuth";
import axios from "axios";

/*async function content_byID(content_id) {
  const apiPath = "rest/api/content/"+content_id;
  const reqUrl = await conf.constrRequestUrl(apiPath);
  const token = await conf.getToken();
  const result = await axios.get(reqUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  //console.log(result.data);
  return result.data;
}*/


async function task() {
  try
  {
  const apiPath = "rest/api/inlinetasks/search";
  const reqUrl = await conf.constrRequestUrl(apiPath);
  const token = await conf.getToken();
  const result = await axios.get(reqUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  console.log(result.data.results);
 }
 catch(err)
 {
   console.log('Error!',err);
 }
}

task();

async function user() {
  try
  {
  const apiPath = "https://api.atlassian.com/me";
  const token = await userConf.getUserToken();
  const result = await axios.get(apiPath, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
   alert(result.data);
  }
  catch(err)
  {
    console.log('Error!',err);
  }
}

user();

/*async function get_data(account_id) {
  console.log(account_id);
  //task(account_id);
}*/

/*async function get_task(tasklist) {
  let user_schema = {};
  console.log(tasklist);
  try
  {
   tasklist.forEach(async (element) => {
     let content_id = element.contentId;
     //let data = await content_byID(content_id);
     let assigned_by = element.creator;
     let status = element.status;
     let due_date;
     if(element.dueDate)
        due_date = element.dueDate;
     else
        due_date = null;
      let body = element.body;
      console.log(body);

   });
  }
  catch(err)
  {
    console.log('Error!',err);
  }
}*/


//user();
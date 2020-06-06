import axios from "axios";

export async function hubAuth() {
  const result = await axios.get(
    "https://us-central1-ctmintask.cloudfunctions.net/api/hub"
  );
  console.log(typeof result.data);
  return result.data;
}

export async function getHubToken() {
  const params = new URLSearchParams(window.location.search);
  const authCode = params.get("code");
  console.log( "auth code is --------------------------------------------------------------------",authCode);
  const result = await axios.post(
    "https://us-central1-ctmintask.cloudfunctions.net/api/code",
    {
      authCode: `${authCode}`,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let assignTime = new Date().getTime();
  result.data.assignTime = assignTime;
  localStorage.setItem("hub", JSON.stringify(result.data));
  console.log(result);

  return result.data.access_token;
}

export async function getRequestUrl(apiPath) {
  return `https://api.hubapi.com/${apiPath}`;
}

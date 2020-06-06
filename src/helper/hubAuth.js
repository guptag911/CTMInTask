import axios from "axios";

export async function hubAuth() {
  const result = await axios.get(
    "https://us-central1-ctmintask.cloudfunctions.net/api/hub"
  );
  console.log(typeof result.data);
  return result.data;
}

export async function getHubToken() {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  console.log(
    "---------------------------------------------------------------------------"
  );
  const params = new URLSearchParams(window.location.search);
  const authCode = params.get("code");
  console.log(
    "auth code is --------------------------------------------------------------------",
    authCode
  );
  const result = await axios.post(
    proxyurl + "https://us-central1-ctmintask.cloudfunctions.net/api/code",
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

  let hub = {
    access_token: result.data,
    assignTime,
  };
  localStorage.setItem("hub", JSON.stringify(hub));

  return result.data;
}

export async function getRequestUrl(apiPath) {
  return `https://api.hubapi.com/${apiPath}`;
}

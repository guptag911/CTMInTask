import axios from "axios";

export async function hubAuth() {
  const result = await axios.get(
    "https://us-central1-ctmintask.cloudfunctions.net/api/hub"
  );
  console.log(typeof result.data);
  return result.data;
}

export async function getHubToken() {
  const result = JSON.parse(localStorage.getItem("hub"));
  if (result && (new Date().getTime() - result.assignTime) / 1000 > 3600) {
    const newToken = await refreshHubToken(result.refresh_token);
    newToken["refresh_token"] = result.refresh_token;
    let assignTime = new Date().getTime();
    newToken["assignTime"] = assignTime;
    localStorage.setItem("hub", JSON.stringify(newToken));
    return newToken.access_token;
  } else if (
    result &&
    (new Date().getTime() - result.assignTime) / 1000 < 3600
  ) {
    return result.access_token;
  } else {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("code");
    console.log(authCode);
    const result = await axios.post(
      "https://api.hubapi.com/oauth/v1/token",
      {
        grant_type: "authorization_code",
        client_id: "49a97a69-1406-4a1d-8eb3-64b9cbed6126",
        client_secret: "0840ac22-bc6d-49dc-90f0-06b472924e17",
        code: `${authCode}`,
        redirect_uri: "http://localhost:3000/",
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

    return result.data.access_token;
  }
}

export async function refreshHubToken(refresh_token) {
  const result = await axios.post(
    "https://api.hubapi.com/oauth/v1/token",
    {
      grant_type: "refresh_token",
      client_id: "49a97a69-1406-4a1d-8eb3-64b9cbed6126",
      client_secret: "0840ac22-bc6d-49dc-90f0-06b472924e17",
      refresh_token: `${refresh_token}`,
      redirect_uri: "http://localhost:3000/",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return result.data;
}

export async function getRequestUrl(apiPath) {
  return `https://api.hubapi.com/${apiPath}`;
}

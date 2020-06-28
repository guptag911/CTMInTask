import axios from "axios";
import "../api/confluence";

export async function auth() {
  const result = await axios.get(
    "https://us-central1-ctmintask.cloudfunctions.net/api/auth"
  );
  return result.data;
}

export async function getToken() {
  const result = JSON.parse(localStorage.getItem("token"));
  if (result && (new Date().getTime() - result.assignTime) / 1000 > 3600) {
    const newToken = await refreshAccessToken(result.refresh_token);
    newToken["refresh_token"] = result.refresh_token;
    let assignTime = new Date().getTime();
    newToken["assignTime"] = assignTime;
    localStorage.setItem("token", JSON.stringify(newToken));
    return newToken.access_token;
  } else if (
    result &&
    (new Date().getTime() - result.assignTime) / 1000 < 3600
  ) {
    return result.access_token;
  } else {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("code");
    // console.log(authCode);
    const result = await axios.post(
      "https://auth.atlassian.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: "LcUQspyPyb8ATVkVEUN5KS4NuIxrI4mO",
        client_secret:
          "wXIyWcPzxQCtgOzZrLSZBmUPPx-fqovQRqjiVAqDSTKpkelS9cpMxBMQMTvdMcp5",
        code: `${authCode}`,
        redirect_uri: "https://ctmintask.web.app/#/dash",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let assignTime = new Date().getTime();
    result.data.assignTime = assignTime;
    localStorage.setItem("token", JSON.stringify(result.data));

    return result.data.access_token;
  }
}

export async function refreshAccessToken(refresh_token) {
  const result = await axios.post(
    "https://auth.atlassian.com/oauth/token",
    {
      grant_type: "refresh_token",
      client_id: "LcUQspyPyb8ATVkVEUN5KS4NuIxrI4mO",
      client_secret:
        "wXIyWcPzxQCtgOzZrLSZBmUPPx-fqovQRqjiVAqDSTKpkelS9cpMxBMQMTvdMcp5",
      refresh_token: `${refresh_token}`,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return result.data;
}

export async function constrRequestUrl(apiPath) {
  const accessToken = await getToken();
  const cloudId = await getCloudId(accessToken);
  return `https://api.atlassian.com/ex/confluence/${cloudId.id}/${apiPath}`;
}

export async function getCloudId(accessToken) {
  const result = await axios.get(
    "https://api.atlassian.com/oauth/token/accessible-resources",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );
  return result.data[0];
}

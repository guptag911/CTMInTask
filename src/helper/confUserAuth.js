import axios from "axios";
import "../api/confluence";

export async function user() {
  const result = await axios.get(
    "https://us-central1-ctmintask.cloudfunctions.net/api/user"
  );
  return result.data;
}

export async function getUserToken() {
  const result = JSON.parse(localStorage.getItem("user"));
  if (result && (new Date().getTime() - result.assignTime) / 1000 > 3600) {
    const newToken = await refreshUserAccessToken(result.refresh_token);
    newToken["refresh_token"] = result.refresh_token;
    let assignTime = new Date().getTime();
    newToken["assignTime"] = assignTime;
    localStorage.setItem("user", JSON.stringify(newToken));
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
      "https://auth.atlassian.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: "LcUQspyPyb8ATVkVEUN5KS4NuIxrI4mO",
        client_secret:
          "wXIyWcPzxQCtgOzZrLSZBmUPPx-fqovQRqjiVAqDSTKpkelS9cpMxBMQMTvdMcp5",
        code: `${authCode}`,
        redirect_uri: "http://localhost:3000/#/dash",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let assignTime = new Date().getTime();
    result.data.assignTime = assignTime;
    localStorage.setItem("user", JSON.stringify(result.data));

    return result.data.access_token;
  }
}

export async function refreshUserAccessToken(refresh_token) {
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

import axios from "axios";

const proxyurl = "https://cors-anywhere.herokuapp.com/";

export async function zoho() {
  const result = await axios.get(
    "https://us-central1-ctmintask.cloudfunctions.net/api/zoho"
  );
  console.log(result.data);
  return result.data;
}

export async function getZohoToken() {
  const result = JSON.parse(localStorage.getItem("zoho"));
  if (result && (new Date().getTime() - result.assignTime) / 1000 > 3600) {
    console.log(
      "zoho called............",
      (new Date().getTime() - result.assignTime) / 1000
    );
    const newToken = await refreshAccessToken(result.refresh_token);
    newToken["refresh_token"] = result.refresh_token;
    let assignTime = new Date().getTime();
    newToken["assignTime"] = assignTime;
    localStorage.setItem("zoho", JSON.stringify(newToken));
    return newToken.access_token;
  } else if (
    result &&
    (new Date().getTime() - result.assignTime) / 1000 < 3600
  ) {
    console.log(
      "zoho called............",
      (new Date().getTime() - result.assignTime) / 1000
    );
    return result.access_token;
  } else {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("code");
    console.log(authCode);
    const result = await axios.post(
      proxyurl +
        `https://accounts.zoho.com/oauth/v2/token?code=${authCode}&redirect_uri=http://localhost:3000/dash&client_id=1000.D0S5M9RCQEYGED0CYGN054DYZ9LTTH&client_secret=54f0bfa7012c1f24a20e22c49eddd9e46ae0d77e93&grant_type=authorization_code`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(result);
    let assignTime = new Date().getTime();
    result.data.assignTime = assignTime;
    localStorage.setItem("zoho", JSON.stringify(result.data));

    return result.data.access_token;
  }
}

export async function refreshAccessToken(refresh_token) {
  const result = await axios.post(
    proxyurl +
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${refresh_token}&client_id=1000.D0S5M9RCQEYGED0CYGN054DYZ9LTTH&client_secret=54f0bfa7012c1f24a20e22c49eddd9e46ae0d77e93&grant_type=refresh_token`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return result.data;
}

import axios from "axios";
import qs from "qs";

export const hubAuthURL =
  "https://app.hubspot.com/oauth/authorize?client_id=49a97a69-1406-4a1d-8eb3-64b9cbed6126&scope=contacts%20sales-email-read&redirect_uri=http://localhost:3000/";
  
  export const TestAuth = async ()=>{
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("code");
    const config = {
        grant_type: "authorization_code",
        client_id: "49a97a69-1406-4a1d-8eb3-64b9cbed6126",
        client_secret: "0840ac22-bc6d-49dc-90f0-06b472924e17",
        redirect_uri: "http://localhost:3000/",
        code:authCode
      };

    const result =await axios.post(proxyurl+"https://api.hubapi.com/oauth/v1/token", qs.stringify(config));
    console.log("response is ", result);

  }
  



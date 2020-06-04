import Button from "@material-ui/core/Button";
import React from "react";
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client();
const CLIENT_ID="9c45499b-4c44-46b7-9398-33b298e731ba";
const REDIRECT_URI = "http://localhost:3000/dash";
const CLIENT_SECRET = "2d1446e6-881c-4c2f-82c9-21ad9db2ef38"
const SCOPES = 'contacts content e-commerce tickets';
const GRANT_TYPES = {
    AUTHORIZATION_CODE: 'authorization_code',
    REFRESH_TOKEN: 'refresh_token',
}
const authorizationUrl = hubspotClient.oauth.getAuthorizationUrl(CLIENT_ID, REDIRECT_URI, SCOPES)


export const HubAuthURL = ()=>{

    return <a href={authorizationUrl}><Button variant="contained" color="primary">
    Connect to HubSpot
    </Button></a>
}


export const HubSignIn = async(props)=>{
  const code = props.location.search.split("=")[1];
  const getTokensResponse = await hubspotClient.oauth.defaultApi.createToken(
        GRANT_TYPES.AUTHORIZATION_CODE,
        code,
        REDIRECT_URI,
        CLIENT_ID,
        CLIENT_SECRET,
    )
    console.log("token is ", getTokensResponse);
}

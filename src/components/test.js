import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EmailInputModel from './emailInputModel';
import { Button } from '@material-ui/core';
import axios from 'axios';
import qs from 'qs';
import {Redirect} from "react-router-dom";


const Hubspot = require('hubspot')
const hubspot = new Hubspot({
  apiKey: '99c4817f-a3a2-4e93-af3e-6eb435a436f0',
  checkLimit: false // (Optional) Specify whether to check the API limit on each call. Default: true
})




const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

export default function TestHubSpot(props){
  const classes = useStyles();

  console.log("props is ",props.location.search.split("=")[1])

  useEffect(()=>{
    const code = props.location.search.split("=")[1];
    if(code){
    const authCodeProof = qs.stringify({
      grant_type: 'authorization_code',
      client_id: "9c45499b-4c44-46b7-9398-33b298e731ba",
      client_secret: "2d1446e6-881c-4c2f-82c9-21ad9db2ef38",
      redirect_uri: "http://localhost:3000/hubspot-test",
      code: code
    });
    axios.post("https://api.hubapi.com/oauth/v1/token", authCodeProof).then((resp)=>{
      console.log("resp is ", resp);
      axios.get("https://api.hubapi.com/contacts/v1/lists/all/contacts/all?count=1", {headers: {
        'Authorization': `Bearer ${resp.data.access_token}`,
        'Content-Type': 'application/json'
      }}).then((resp)=>{
        console.log("hubspot contacts data is ", resp.data);
      }).catch((e)=>{
        console.log("hubspot data error ", e);
      })
      // window.localStorage.setItem("hubspot-access-token", resp.data.access_token);
      // window.localStorage.setItem("hubspot-refresh-token", resp.data.refresh_token);
    }).catch((e)=>{
      console.log("error is ", e);
    })
  }

  })

  return (
    <Redirect to="/dash"></Redirect>
  );
}

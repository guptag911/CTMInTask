import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EmailInputModel from './emailInputModel';
import { Button } from '@material-ui/core';
import axios from 'axios';

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

  console.log("props is ",props)

  return (
    <form className={classes.root} noValidate autoComplete="off">
        <EmailInputModel></EmailInputModel>
        <a href="https://app.hubspot.com/oauth/authorize?client_id=9c45499b-4c44-46b7-9398-33b298e731ba&redirect_uri=http://localhost:3000/hubspot-test/&scope=contacts%20content%20automation%20timeline%20tickets%20e-commerce"><Button>authorize hubspot</Button></a>
    </form>
  );
}

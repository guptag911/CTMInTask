import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EmailInputModel from './emailInputModel';
import { Button } from '@material-ui/core';
import axios from 'axios';
import {HubAuthURL} from "../helper/hubSpotOAuth";

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

export default function EmailReplyCard() {
  const classes = useStyles();


  return (
      <HubAuthURL></HubAuthURL>
  );
}

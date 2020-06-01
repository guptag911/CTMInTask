import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import EmailInputModel from './emailInputModel';

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
    <form className={classes.root} noValidate autoComplete="off">
        <EmailInputModel></EmailInputModel>
    </form>
  );
}

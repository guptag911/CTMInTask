/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { firebaseAuth } from "../config/config";
import { Link } from "react-router-dom";
import { signout } from "../helper/auth";
import { db } from "../config/config";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Profile = (props) => {
  const [open, setOpen] = useState(false);
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      console.log("Hey", user.displayName);
      // window.sessionStorage.setItem(
      //   "user",
      //   JSON.stringify(user.providerData[0])
      // );
    } else {
      console.log("No users");
    }
  });

  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = async () => {
    setOpen(false);
  };

  const handleLogOut = async () => {
    await signout();
    window.sessionStorage.clear();
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Your Profile
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Account Information
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <img
              src={user ? user.photoURL : "../../public/anime.jpg"}
              alt="profile Image"
              width="25%"
              height="25%"
              style={{ borderRadius: "25%" }}
            />
          </Typography>
          <Typography gutterBottom>
            <b>Username: {user ? user.displayName : "Happy Man"}</b>
          </Typography>
          <Typography gutterBottom>
            <b>Email: {user ? user.email : "nil"}</b>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleLogOut}
            color="primary"
            component={Link}
            to="/"
          >
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;

/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { signout, signIn } from "../helper/auth";
import { firebaseAuth } from "../config/config";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import issues_data from "../api/jira";
import getConf_data from "../api/confluence";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(0),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "96vh",
  },

  loginButton: {
    color: "#fff",
    background: "#000",
    borderRadius: "6px",
    border: "2px solid #000",
    height: "48px",
    fontWeight: 700,
    fontSize: "16px",
    marginTop: "22px",
  },

  gridText: {
    width: "100%",
    lineHeight: "40px",
    fontSize: "34px !important",
    fontWeight: "bold",
    fontFamily: "Nunito Sans !important",
    textAlign: "left",
    color: "black",
    textAlign: "center",
  },

  loginPaper: {
    padding: theme.spacing(2),
    margin: theme.spacing(0),
    textAlign: "center",
    color: theme.palette.text.secondary,
    width: "350px",
    height: "200px",
    margin: "30% auto",
  },
}));

const style = {
  width: "100px",
  height: "20px",
};
const Home = () => {
  const classes = useStyles();
  const [currentUser, setCurrentUser] = useState(null);

  const handleUser = async (e) => {
    if (currentUser) {
      await signout();
      window.sessionStorage.clear();
    } else {
      await signIn();
    }
  };

  if (currentUser) {
    if (
      window.localStorage.getItem("user") &&
      window.localStorage.getItem("jira")
    ) {
      issues_data();
    }
    if (
      window.localStorage.getItem("user") &&
      window.localStorage.getItem("token")
    ) {
      getConf_data();
    }
  }

  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
      let userData = {
        displayNam: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      };
      window.sessionStorage.setItem("user", JSON.stringify(userData));
      return user;
    } else {
      setCurrentUser(null);
      return null;
    }
  });

  return (
    <div className={classes.root}>
      <Grid container spacing={0} style={{ overflow: "hidden" }}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <Grid container spacing={3} style={{ margin: "30% auto" }}>
              <Grid item xs={12} sm={12}>
                <Typography>
                  <img
                    src="https://innovaccer.com/static/image/site-logo/innovaccer-logo-black.svg"
                    alt="Innovaccer"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography className={classes.gridText}>
                  Your Personal Central Task Manager
                </Typography>
                <Typography className={classes.gridText}>
                  A Dashboard, One for all.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper
            className={classes.paper}
            style={{ backgroundColor: "#e4e4e4" }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <Paper elevation={3} className={classes.loginPaper}>
                  {currentUser ? (
                    <div>
                      <Typography className={classes.gridText}>
                        Go to your Dashboard
                      </Typography>
                      <Typography>
                        <Button
                          variant="contained"
                          className={classes.loginButton}
                          component={Link}
                          to="/dash"
                        >
                          Dashboard
                        </Button>
                      </Typography>
                    </div>
                  ) : (
                    <div>
                      <Typography className={classes.gridText}>
                        Login into your account
                      </Typography>
                      <Typography>
                        <Button
                          variant="contained"
                          className={classes.loginButton}
                          onClick={handleUser}
                        >
                          <img
                            src="http://i.xp.io/2L6Jh5Os.png"
                            style={{ padding: "10px" }}
                          />
                          Continue with Google
                        </Button>
                      </Typography>
                    </div>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;

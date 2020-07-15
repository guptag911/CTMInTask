import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import TabView from "../components/tabView";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { get_data } from "../api/fixedGsuite";
import { delete_tasks, insert_tasks } from "../api/googleTasks";
import { HubSpotTasksGetAPIData } from "../api/hubSpot";
import issues_data from "../api/jira";
import getConf_data from "../api/confluence";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    fontFamily:
      '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif !important',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  if (JSON.parse(sessionStorage.getItem("user"))) {
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

  React.useEffect(() => {
    setTimeout(() => {
      get_data("from: comments-noreply@docs.google.com");
      delete_tasks();
      insert_tasks();
      HubSpotTasksGetAPIData();
    }, 4000);
  }, []);
  // console.log("Analytics is ", analyticsClicked);
  return (
    <div className={classes.root}>
      {/* <NavigationBar /> */}
      {
        <Grid container spacing={2} maxWidth="lg" style={{ marginTop: "40px" }}>
          <Grid item xs={12}>
            <Container>
              {" "}
              <TabView></TabView>
            </Container>
          </Grid>
        </Grid>
      }
    </div>
  );
};

export default Dashboard;

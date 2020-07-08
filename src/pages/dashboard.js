import React, { useState } from "react";
import NavigationBar from "../components/NavBar";
import Container from "@material-ui/core/Container";
import TabView from "../components/tabView";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { get_data } from "../api/fixedGsuite";
import { delete_tasks, insert_tasks } from "../api/googleTasks";
import { HubSpotTasksGetAPIData } from "../api/hubSpot";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  React.useEffect(() => {
    get_data("from: comments-noreply@docs.google.com");
    setTimeout(() => {
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

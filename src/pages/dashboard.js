import React, { useState } from "react";
import NavigationBar from "../components/NavBar";
import Container from "@material-ui/core/Container";
import TabView from "../components/tabView";
import { makeStyles } from '@material-ui/core/styles';
import AssessmentIcon from '@material-ui/icons/Assessment';
import Grid from '@material-ui/core/Grid';
import { get_data } from "../api/fixedGsuite";
import { delete_tasks, insert_tasks } from "../api/googleTasks";
import { HubSpotTasksGetAPIData } from "../api/hubSpot";
import Drawer from "../components/Analytics";
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import {red} from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Dashboard = () => {

  const classes = useStyles();

  const [analyticsClicked, OpenAnalytics] = useState(false);


  const onClickHandler = (event) => {
    OpenAnalytics(true);
  }

  const onClickHandlerClose = (event) =>{
    OpenAnalytics(false);
  }

  React.useEffect(() => {
    get_data("from: comments-noreply@docs.google.com");
    setTimeout(() => {
      delete_tasks();
      insert_tasks();
      HubSpotTasksGetAPIData();
    }, 5000);
  }, []);
  // console.log("Analytics is ", analyticsClicked);
  return (
    <div className={classes.root}>
      <NavigationBar />
      {analyticsClicked ? <Grid container spacing={2} maxWidth="lg" style={{ marginTop: "100px" }}>
        <Grid item xs={9}>
          <Container> <TabView></TabView></Container>
        </Grid>
        <Grid item xs={2}>
          <Drawer></Drawer>
        </Grid>
        <Grid item xs={1}>
        <Button onClick={onClickHandlerClose}><ClearIcon></ClearIcon></Button>
        </Grid>
      </Grid> : <Grid container spacing={2} maxWidth="lg" style={{ marginTop: "100px" }}>
          <Grid item xs={11}>
            <Container> <TabView></TabView></Container>
          </Grid>
          <Grid item xs={1}>
            <Button onClick={onClickHandler}> <AssessmentIcon style={{ fontSize: 60, color: red[500]}}></AssessmentIcon></Button>
          </Grid>
        </Grid>}
    </div>
  );
};

export default Dashboard;

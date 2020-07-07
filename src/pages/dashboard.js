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
import { red, blue, yellow } from '@material-ui/core/colors';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

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

  const [sideClicked, OpenSideBar] = useState(false);

  const [service, setService]=useState(null);


  const onClicAnalyticskHandler = (event) => {
    setService("analytics");
    OpenSideBar(true);
  }

  const onClickHandlerClose = (event) => {
    OpenSideBar(false);
  }

  const onClickStarTaskHandler = (event)=>{
    setService("star_tasks");
    OpenSideBar(true);
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
      {sideClicked ? <Grid container spacing={2} maxWidth="lg" style={{ marginTop: "100px" }}>
        <Grid item xs={8}>
          <Container> <TabView></TabView></Container>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={onClickHandlerClose}><ClearIcon></ClearIcon></Button>
          <Drawer service={service}></Drawer>
        </Grid>
        {/* <Grid item xs={1}> */}
        {/* <Button onClick={onClickHandlerClose}><ClearIcon></ClearIcon></Button> */}
        {/* </Grid> */}
      </Grid> : <Grid container spacing={2} maxWidth="lg" style={{ marginTop: "100px" }}>
          <Grid item xs={11}>
            <Container> <TabView></TabView></Container>
          </Grid>
          <Grid item xs={1}>
            <Button onClick={onClicAnalyticskHandler}>
              <Tooltip style={{ "width": 200, fontWeight:"bold", fontSize:100 }} title="Analytics">
                {/* <IconButton aria-label="delete"> */}
                <AssessmentIcon style={{ fontSize: 60, color: red[300] }}></AssessmentIcon>
                {/* </IconButton> */}
              </Tooltip>
            </Button>
            <Button onClick={onClickStarTaskHandler}>
              <Tooltip style={{ "width": 200, fontWeight:"bold", fontSize:100 }} title="Starred Tasks">
                {/* <IconButton aria-label="delete"> */}
                <BookmarkIcon style={{ fontSize: 60, color: blue[300] }}></BookmarkIcon>
                {/* </IconButton> */}
              </Tooltip>
            </Button>
          </Grid>
        </Grid>}
    </div>
  );
};

export default Dashboard;

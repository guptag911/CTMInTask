import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CardView from "./card";
import CalenderCard from "./calenderCard";
import Button from "@material-ui/core/Button";
import { firebaseAuth } from "../config/config";
import { auth, getToken } from "../helper/confAuth";
import { getUserToken } from "../helper/confUserAuth";
import { hubAuth, getHubToken } from "../helper/hubAuth";
import { ReactAutosuggestExample, EmailData } from "./reactAutoSuggest";
import { jiraAuth, getJiraToken } from "../helper/jiraAuth";
import ConfluenceCard from "./confluenceCard";
import HubSpotCard from "./hubspotCard";
import JiraCard from "./jiraCard";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  // console.log("email data is ", EmailData);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    marginTop: 20,
  },

  bold: {
    fontWeight: "bold",
  },

  center: {
    margin: "0 auto",
  },
}));

export default function ScrollableTabsButtonAuto() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [authState, setAuthSate] = React.useState(
    JSON.parse(localStorage.getItem("token"))
  );
  const [hubState, setHubState] = React.useState(
    JSON.parse(localStorage.getItem("hub"))
  );

  const [jiraState, setJiraState] = React.useState(
    JSON.parse(localStorage.getItem("jira"))
  );

  const [clickState, setclickState] = React.useState(
    JSON.parse(localStorage.getItem("state")) || {
      hub: false,
      conf: false,
      Jira: false,
      user: false,
    }
  );

  let state = {
    hub: false,
    conf: false,
    Jira: false,
    user: false,
  };

  // if(firebaseAuth.currentUser)
  // console.log("firebase user is ", firebaseAuth.currentUser.email);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleState = (e) => {
    e.preventDefault();
    if (!window.localStorage.getItem("token")) {
      alert(
        'Connect to confluence and then Click the "Identify Yourself" button to identify yourself'
      );
    } else if (
      window.localStorage.getItem("token") &&
      !window.localStorage.getItem("user")
    ) {
      alert('Click the "Identify Yourself" button to identify yourself');
    }
  };

  const handleReq = async (e) => {
    state = {
      hub: false,
      conf: true,
      Jira: false,
      user: false,
    };
    localStorage.setItem("state", JSON.stringify(state));

    const res = await auth();
    window.location.href = res;
  };

  const handleHub = async (e) => {
    state = {
      hub: true,
      conf: false,
      Jira: false,
      user: false,
    };
    localStorage.setItem("state", JSON.stringify(state));

    const res = await hubAuth();
    // console.log(res);
    window.location.href = res;
  };

  const handleJira = async (e) => {
    state = {
      hub: false,
      conf: false,
      Jira: true,
      user: false,
    };
    localStorage.setItem("state", JSON.stringify(state));
    const res = await jiraAuth();
    window.location.href = res;
  };

  const params = new URLSearchParams(window.location.search);
  const authCode = params.get("code");
  setTimeout(() => {
    if (clickState.hub && authCode) {
      window.location.reload(false);
      state = {
        hub: false,
        conf: false,
        Jira: false,
        user: false,
      };
      localStorage.setItem("state", JSON.stringify(state));
    }

    if (clickState.Jira && authCode) {
      window.location.reload(false);
      state = {
        hub: false,
        conf: false,
        Jira: false,
        user: false,
      };
      localStorage.setItem("state", JSON.stringify(state));
    }

    if (clickState.conf && authCode) {
      window.location.reload(false);
      state = {
        hub: false,
        conf: false,
        Jira: false,
        user: false,
      };
      localStorage.setItem("state", JSON.stringify(state));
    }

    if (clickState.user && authCode) {
      window.location.reload(false);
      state = {
        hub: false,
        conf: false,
        Jira: false,
        user: false,
      };
      localStorage.setItem("state", JSON.stringify(state));
    }
  }, 5000);

  React.useEffect(() => {
    if (clickState.hub) {
      handleHubAuth();
    } else if (clickState.Jira) {
      handleJiraAuth();
    } else if (clickState.conf) {
      handleAuth();
    } else if (clickState.user) {
      handleUser();
    }
  }, [window.onload]);

  const handleAuth = async () => {
    await getToken();
  };

  const handleUser = async () => {
    await getUserToken();
  };

  const handleJiraAuth = async () => {
    await getJiraToken();
  };

  const handleHubAuth = async () => {
    await getHubToken();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Gsuite" {...a11yProps(0)} className={classes.bold} />
          <Tab
            label="Calendar Events"
            {...a11yProps(1)}
            className={classes.bold}
          />
          <Tab
            label="Reply to Mails"
            {...a11yProps(2)}
            className={classes.bold}
          />
          <Tab label="HubSpot" {...a11yProps(3)} className={classes.bold} />
          <Tab label="Jira" {...a11yProps(4)} className={classes.bold} />
          <Tab
            label="Confluence"
            {...a11yProps(5)}
            className={classes.bold}
            onClick={handleState}
          />
          
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <CardView></CardView>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CalenderCard></CalenderCard>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ReactAutosuggestExample />
      </TabPanel>
      <TabPanel value={value} index={3}>
        {firebaseAuth.currentUser && !hubState ? (
          <Button
            variant="contained"
            color="primary"
            className={classes.center}
            onClick={handleHub}
          >
            Connect to HubSpot
          </Button>
        ) : (
          <HubSpotCard></HubSpotCard>
        )}
      </TabPanel>
      <TabPanel value={value} index={4}>
        {firebaseAuth.currentUser && !jiraState ? (
          <Button
            variant="contained"
            color="primary"
            className={classes.center}
            onClick={handleJira}
          >
            Connect to Jira
          </Button>
        ) : (
          <JiraCard></JiraCard>
        )}
      </TabPanel>
      <TabPanel value={value} index={5}>
        {firebaseAuth.currentUser && !authState ? (
          <Button
            variant="contained"
            color="primary"
            className={classes.center}
            onClick={handleReq}
          >
            Connect to Confluence
          </Button>
        ) : (
          <ConfluenceCard></ConfluenceCard>
        )}
      </TabPanel>
    </div>
  );
}

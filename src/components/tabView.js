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
import EmailReplyCard from "./replyEmailsCard";
import Button from "@material-ui/core/Button";
import { firebaseAuth } from "../config/config";
import { auth, getToken } from "../helper/confAuth";
import { getUserToken } from "../helper/confUserAuth";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleReq = async (e) => {
    const res = await auth();
    window.location.href = res;
    await handleAuth();
  };

  const handleAuth = async () => {
    if (authState) {
      await getUserToken();
    } else {
      await getToken();
    }
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
          <Tab label="Google Docs" {...a11yProps(0)} className={classes.bold} />
          <Tab
            label="Google Sheets"
            {...a11yProps(1)}
            className={classes.bold}
          />
          <Tab
            label="Google Slides"
            {...a11yProps(2)}
            className={classes.bold}
          />
          <Tab
            label="Calendar Events"
            {...a11yProps(3)}
            className={classes.bold}
          />
          <Tab
            label="Reply to Mails"
            {...a11yProps(4)}
            className={classes.bold}
          />
          <Tab label="HubSpot" {...a11yProps(5)} className={classes.bold} />
          <Tab label="Jira" {...a11yProps(6)} className={classes.bold} />
          <Tab label="Confluence" {...a11yProps(7)} className={classes.bold} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <CardView product="gsuites" data="gdocs"></CardView>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CardView product="gsuites" data="gsheets"></CardView>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CardView product="gsuites" data="gslides"></CardView>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <CalenderCard></CalenderCard>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <EmailReplyCard></EmailReplyCard>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Button variant="contained" color="primary">
          Connect to HubSpot
        </Button>
        <CardView product="HubSpot" data="hubspot"></CardView>
      </TabPanel>
      <TabPanel value={value} index={6}>
        {firebaseAuth.currentUser &&
        !authState &&
        (firebaseAuth.currentUser.email === "abhilnm011@gmail.com" ||
          firebaseAuth.currentUser.email ===
            "abhishek.tiwari@innovaccer.com") ? (
          <Button
            variant="contained"
            color="primary"
            className={classes.center}
          >
            Connect to Jira
          </Button>
        ) : (
          <CardView product="Jira" data="jira"></CardView>
        )}
      </TabPanel>
      <TabPanel value={value} index={7}>
        {firebaseAuth.currentUser &&
        !authState &&
        (firebaseAuth.currentUser.email === "abhilnm011@gmail.com" ||
          firebaseAuth.currentUser.email ===
            "abhishek.tiwari@innovaccer.com") ? (
          <Button
            variant="contained"
            color="primary"
            className={classes.center}
            onClick={handleReq}
          >
            Connect to Confluence
          </Button>
        ) : (
          <CardView product="Confluence" data="confluence"></CardView>
        )}
      </TabPanel>
    </div>
  );
}

import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CardView from "./card";
import CalenderCard from './calenderCard';

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
}));

const data1 = [
  { id: 0, done: true, by: "user1", task: "task1", url: "#" },
  { id: 1, done: false, by: "user2", task: "task2", url: "#" },
  { id: 2, done: true, by: "user3", task: "task3", url: "#" },
];
const data2 = [
  { id: 0, done: false, by: "user11", task: "task11", url: "#" },
  { id: 1, done: false, by: "user12", task: "task12", url: "#" },
  { id: 2, done: true, by: "user13", task: "task13", url: "#" },
];
const data3 = [
  { id: 0, done: false, by: "user111", task: "task111", url: "#" },
  { id: 1, done: false, by: "user122", task: "task122", url: "#" },
  { id: 2, done: false, by: "user133", task: "task133", url: "#" },
];
const data4 = [
  { id: 0, done: false, by: "user1111", task: "task1111", url: "#" },
  { id: 1, done: false, by: "user1222", task: "task1222", url: "#" },
  { id: 2, done: false, by: "user1333", task: "task1333", url: "#" },
];
const data5 = [
  { id: 0, done: false, by: "user11111", task: "task11111", url: "#" },
  { id: 1, done: true, by: "user12222", task: "task12222", url: "#" },
  { id: 2, done: false, by: "user13333", task: "task13333", url: "#" },
];
export default function ScrollableTabsButtonAuto() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
          <Tab label="Calender Events" {...a11yProps(3)} className={classes.bold} />
          <Tab label="Jira" {...a11yProps(4)} className={classes.bold} />
          <Tab label="Confluence" {...a11yProps(5)} className={classes.bold} />
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
        <CardView product="jira" data={data4}></CardView>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <CardView product="confluence" data={data5}></CardView>
      </TabPanel>
    </div>
  );
}

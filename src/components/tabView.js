import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CardView from "./card";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  var request = window.indexedDB.open("firebaseLocalStorageDb", 5);
  request.onerror = function (event) {
    console.log("indexdb is error ", request);
  };
  request.onsuccess = function (event) {
    console.log("indexdb is success ", request.result);
    var db = event.target.result;
    var transaction = db.transaction(["firebaseLocalStorage"]);
    var objectStore = transaction.objectStore("firebaseLocalStorage");
    console.log("objectstore ", objectStore);
    var request1 = objectStore.get("firebase:authUser:AIzaSyAaQHOvz_m-PBJa2QFhCuT82aIzFc2ZQVI:[DEFAULT]");
    console.log("requests 1 is ", request1);
    request1.onerror = function (event) {
      console.log("in error ", request1.result);
    };
    request1.onsuccess = function (event) {
      // Do something with the request.result!
      console.log("data is " + request1.result.value.stsTokenManager.apiKey);
    };
  };
  // request.onupgradeneeded = function(event) { 
  //   // Save the IDBDatabase interface 
  //   var db = event.target.result;
  //   var transaction = db.transaction(["firebaseLocalStorage"]);
  //   var objectStore = transaction.objectStore("firebaseLocalStorage");
  //   console.log("objectstore ", objectStore);
  //   var request1 = objectStore.get("__sak527895535");
  //   console.log("requests 1 is ", request1);
  //     request1.onerror = function (event) {
  //       console.log("in error ", request1);
  //     };
  //     request1.onsuccess = function (event) {
  //       // Do something with the request.result!
  //       console.log("Name for SSN 444-44-4444 is " + request.result);
  //     };
  // };

  // const dbName = "the_name";
  // const customerData = [
  //   { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  //   { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
  // ];

  // var request = indexedDB.open(dbName, 2);

  // request.onerror = function (event) {
  //   // Handle errors.
  //   console.log("in error ", request);
  // };

  // request.onsuccess = (event) =>{
  //   console.log("success");
  //   var db = event.target.result;
  //   var transaction = db.transaction(["customers"]);
  //     var objectStore = transaction.objectStore("customers");
  //     console.log("objectstore in dub is ", objectStore);
  //     var request = objectStore.get("444-44-4444");
  //     request.onerror = function (event) {
  //       // Handle errors!
  //     };
  //     request.onsuccess = function (event) {
  //       // Do something with the request.result!
  //       console.log("Name for SSN 444-44-4444 is " + request.result.name);
  //     };
  // }

  // request.onupgradeneeded = function (event) {
  //   var db = event.target.result;
  //   console.log("in upgrade");

  // Create an objectStore to hold information about our customers. We're
  // going to use "ssn" as our key path because it's guaranteed to be
  // unique - or at least that's what I was told during the kickoff meeting.
  // var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

  // Create an index to search customers by name. We may have duplicates
  // so we can't use a unique index.
  // objectStore.createIndex("name", "name", { unique: false });

  // Create an index to search customers by email. We want to ensure that
  // no two customers have the same email, so use a unique index.
  // objectStore.createIndex("email", "email", { unique: true });

  // Use transaction oncomplete to make sure the objectStore creation is 
  // finished before adding data into it.
  // objectStore.transaction.oncomplete = function (event) {
  //   // Store values in the newly created objectStore.
  //   var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
  //   customerData.forEach(function (customer) {
  //     customerObjectStore.add(customer);
  //   });
  //     var transaction = db.transaction(["customers"]);
  //     var objectStore = transaction.objectStore("customers");
  //     console.log("objectstore in dub is ", objectStore);
  //     var request = objectStore.get("444-44-4444");
  //     request.onerror = function (event) {
  //       // Handle errors!
  //     };
  //     request.onsuccess = function (event) {
  //       // Do something with the request.result!
  //       console.log("Name for SSN 444-44-4444 is " + request.result.name);
  //     };
  //   // };
  // };


  // var request1 = indexedDB.open('firebaseLocalStorageDb', 2);

  // request1.onerror = function (event) {
  //   console.log(request1.result);
  // };



  // request1.onupgradeneeded = function (event) { 
  //   var db = event.target.result;
  //   var transaction = db.transaction(["firebaseLocalStorage"]);
  //   var objectStore = transaction.objectStore("firebaseLocalStorage");
  //   request1.onerror = function (event) {
  //     console.log(request1.result);
  //   };
  //   request1.onsuccess = function (event) {
  //     // Do something with the request.result!
  //     console.log("objectstore is ",objectStore);
  //   };

  // }

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
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginTop: 20
  },
}));

const data1 = [{ "id": 0, "done": true, "by": "user1", "task": "task1", "url": "#" }, { "id": 1, "done": false, "by": "user2", "task": "task2", "url": "#" }, { "id": 2, "done": true, "by": "user3", "task": "task3", "url": "#" }]
const data2 = [{ "id": 0, "done": false, "by": "user11", "task": "task11", "url": "#" }, { "id": 1, "done": false, "by": "user12", "task": "task12", "url": "#" }, { "id": 2, "done": true, "by": "user13", "task": "task13", "url": "#" }]
const data3 = [{ "id": 0, "done": false, "by": "user111", "task": "task111", "url": "#" }, { "id": 1, "done": false, "by": "user122", "task": "task122", "url": "#" }, { "id": 2, "done": false, "by": "user133", "task": "task133", "url": "#" }]
const data4 = [{ "id": 0, "done": false, "by": "user1111", "task": "task1111", "url": "#" }, { "id": 1, "done": false, "by": "user1222", "task": "task1222", "url": "#" }, { "id": 2, "done": false, "by": "user1333", "task": "task1333", "url": "#" }]
const data5 = [{ "id": 0, "done": false, "by": "user11111", "task": "task11111", "url": "#" }, { "id": 1, "done": true, "by": "user12222", "task": "task12222", "url": "#" }, { "id": 2, "done": false, "by": "user13333", "task": "task13333", "url": "#" }]
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
          <Tab label="Google Docs" {...a11yProps(0)} />
          <Tab label="Google Sheets" {...a11yProps(1)} />
          <Tab label="Google Slides" {...a11yProps(2)} />
          <Tab label="Jira" {...a11yProps(3)} />
          <Tab label="Item Five" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <CardView data={data1}></CardView>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CardView data={data2}></CardView>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CardView data={data3}></CardView>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <CardView data={data4}></CardView>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <CardView data={data5}></CardView>
      </TabPanel>
    </div>
  );
}

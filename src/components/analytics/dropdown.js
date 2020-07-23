/* eslint-disable default-case */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import GsuiteAnalytics from "./gsuiteAnalytics";
import JiraAnalytics from "./jiraAnalytics";
import ConfluenceAnalytics from "./confluenceAnalytics";
import HubspotAnalytics from "./hubspotAnalytics";
import OverallAnalytics from "./analyticsChart";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  root: {
    // height: 100,
    flexGrow: 1,
    // maxWidth: 400,
    float: "left",
  },
  label: {
    fontSize: "18px",
    backgroundColor: "white",
    border: "2px solid",
    background: "white",
    color: "black",
    margin: "2px",
    borderRadius: "10px",
    boxShadow: "8px 10px 20px -8px black",
    padding: "5px",
  },
});

export default function ControlledTreeView(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [cont, setCont] = React.useState(
    <OverallAnalytics open={props.open} id={props.id}></OverallAnalytics>
  );

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    console.log("Event and nodeIds are ", event, nodeIds);
    setSelected(nodeIds);
  };

  const onClickHandler = (product) => {
    switch (product) {
      case "overall":
        setCont(
          <OverallAnalytics open={props.open} id={props.id}></OverallAnalytics>
        );
        break;
      case "gsuite":
        setCont(
          <GsuiteAnalytics open={props.open} id={props.id}></GsuiteAnalytics>
        );
        break;
      case "jira":
        setCont(
          <JiraAnalytics open={props.open} id={props.id}></JiraAnalytics>
        );
        break;
      case "conf":
        setCont(
          <ConfluenceAnalytics
            open={props.open}
            id={props.id}
          ></ConfluenceAnalytics>
        );
        break;
      case "hub":
        setCont(
          <HubspotAnalytics open={props.open} id={props.id}></HubspotAnalytics>
        );
    }
  };

  return (
    <React.Fragment>
      <Grid container spacing={10}>
        <Grid item xs={12} sm={2}>
          <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            expanded={expanded}
            selected={selected}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
            style={{ backgroundColor: "white" }}
          >
            <TreeItem
              classes={{ label: classes.label }}
              nodeId="1"
              label="Overall Analytics"
              onClick={(e) => {
                onClickHandler("overall");
              }}
            >
              <TreeItem
                classes={{ label: classes.label }}
                nodeId="2"
                label="Gsuite Analytics"
                onClick={(e) => {
                  onClickHandler("gsuite");
                }}
              ></TreeItem>
              <TreeItem
                classes={{ label: classes.label }}
                nodeId="3"
                label="Jira Analytics"
                onClick={(e) => {
                  onClickHandler("jira");
                }}
              ></TreeItem>
              <TreeItem
                classes={{ label: classes.label }}
                nodeId="4"
                label="Confluence Analytics"
                onClick={(e) => {
                  onClickHandler("conf");
                }}
              ></TreeItem>
              <TreeItem
                classes={{ label: classes.label }}
                nodeId="5"
                label="Hubspot Analytics"
                onClick={(e) => {
                  onClickHandler("hub");
                }}
              ></TreeItem>
            </TreeItem>
          </TreeView>
        </Grid>
        <Grid item xs={12} sm={10}>
          <Container>{cont}</Container>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

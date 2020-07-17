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

const useStyles = makeStyles({
  root: {
    // height: 100,
    flexGrow: 1,
    // maxWidth: 400,
    float: "left"
  },
  label: {
    backgroundColor: "grey",
    color: "red"
  }
});

export default function ControlledTreeView() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [cont, setCont] = React.useState(<OverallAnalytics></OverallAnalytics>);

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
        setCont(<OverallAnalytics></OverallAnalytics>)
        break;
      case "gsuite":
        setCont(<GsuiteAnalytics></GsuiteAnalytics>)
        break;
      case "jira":
        setCont(<JiraAnalytics></JiraAnalytics>)
        break;
      case "conf":
        setCont(<ConfluenceAnalytics></ConfluenceAnalytics>)
        break;
      case "hub":
        setCont(<HubspotAnalytics></HubspotAnalytics>)
    }
  }

  return (
    <React.Fragment>
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        style={{backgroundColor:"white"}}
      >
        <TreeItem classes={{ label: classes.label }} nodeId="1" label="Overall Analytics" onClick={(e) => { onClickHandler("overall") }}>
          <TreeItem classes={{ label: classes.label }} nodeId="2" label="Gsuite Analytics" onClick={(e) => { onClickHandler("gsuite") }}>
          </TreeItem>
          <TreeItem classes={{ label: classes.label }} nodeId="3" label="Jira Analytics" onClick={(e) => { onClickHandler("jira") }}>
          </TreeItem>
          <TreeItem classes={{ label: classes.label }} nodeId="4" label="Confluence Analytics" onClick={(e) => { onClickHandler("conf") }}>
          </TreeItem>
          <TreeItem classes={{ label: classes.label }} nodeId="5" label="Hubspot Analytics" onClick={(e) => { onClickHandler("hub") }}>
          </TreeItem>
        </TreeItem>
      </TreeView>
      <Container>
        {cont}
      </Container>
    </React.Fragment>
  );
}

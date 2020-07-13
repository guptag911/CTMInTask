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

const useStyles = makeStyles({
  root: {
    // height: 100,
    flexGrow: 1,
    // maxWidth: 400,
  },
});

export default function ControlledTreeView() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      selected={selected}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
    >
      <TreeItem nodeId="1" label="Overall Analytics">
        <TreeItem nodeId="2" label="Gsuite Analytics">
          <GsuiteAnalytics></GsuiteAnalytics>
        </TreeItem>
        <TreeItem nodeId="3" label="Jira Analytics">
          <JiraAnalytics></JiraAnalytics>
        </TreeItem>
        <TreeItem nodeId="4" label="Confluence Analytics">
          <ConfluenceAnalytics></ConfluenceAnalytics>
        </TreeItem>
        <TreeItem nodeId="5" label="Hubspot Analytics">
          <HubspotAnalytics></HubspotAnalytics>
        </TreeItem>
      </TreeItem>
    </TreeView>
  );
}

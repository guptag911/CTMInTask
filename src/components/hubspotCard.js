import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// new Ui
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import LaunchSharpIcon from "@material-ui/icons/LaunchSharp";

import StarBorderIcon from "@material-ui/icons/StarBorder";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import StarIcon from "@material-ui/icons/Star";
import { saveStarHubspotData, deleteStarHubspotData } from "../api/star";
import { red, blue, yellow } from "@material-ui/core/colors";

import {
  HubSpotTasksGetAPIData,
  HubSpotDataGet,
  HubSpotSingleDataSave,
} from "../api/hubSpot";

const useStyleLoader = makeStyles((theme) => ({
  root: {
    margin: 200,
  },
}));

const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down("sm")]: {
    root: {
      maxWidth: "100%",
      margin: 20,
      float: "left",
      display: "inline-block",
    },
  },
  [theme.breakpoints.up("sm")]: {
    root: {
      maxWidth: "30%",
      margin: 20,
      float: "left",
      display: "inline-block",
    },
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  checked: {
    background: "#e84993",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "10%",
    flexShrink: 0,
    marginRight: "2%",
    fontFamily: "'Nunito Sans', sans-serif",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    marginRight: "2%",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    fontFamily: "'Nunito Sans', sans-serif",
  },
  descpHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    fontFamily: "'Nunito Sans', sans-serif",
  },
}));

export default function SimpleCard(props) {
  const classes = useStyles();
  const [data, getData] = useState(null);
  const classesLoader = useStyleLoader();
  let [Loader, setLoader] = useState(true);
  let [renderAgain, setRender] = useState(0);

  const [expanded, setExpanded] = React.useState(true);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };
  useEffect(() => {
    setLoader(true);
    (async function anyNameFunction() {
      try {
        const data = await HubSpotDataGet();
        console.log("in data ", data);
        getData(data);
        setLoader(false);
      } catch (e) {
        console.log("Error is ", e);
        getData([]);
        setLoader(false);
      }
    })();
  }, []);

  useEffect(() => {
    getData(data);
  }, [renderAgain]);

  const MouseOverHandler = (e) => {
    e.target.style.background = "rgba(222,222,222,0.8)";
  };
  const MouseLeaveHandler = (e) => {
    e.target.style.background = "white";
  };

  const onClickStarHandler = async (is_starred, element, index) => {
    let Ndata = data;
    if (is_starred) {
      element["is_starred"] = false;
      Ndata[index] = element;
      getData(Ndata);
      setRender(renderAgain + 1);
      const fdata = deleteStarHubspotData(
        "hubspot",
        element.engagement.id.toString()
      );
    } else {
      element["is_starred"] = true;
      Ndata[index] = element;
      getData(Ndata);
      setRender(renderAgain + 1);
      const data = saveStarHubspotData("hubspot", element);
    }
    const ndata = HubSpotSingleDataSave(element);
  };

  return (
    <React.Fragment>
      {data && !Loader ? (
        data.map((element, index) => {
          return element.metadata.status!=="COMPLETED" ? (
            <ExpansionPanel
              onMouseOut={MouseLeaveHandler}
              onMouseOver={MouseOverHandler}
              key={element.engagement.id}
              expanded={expanded}
              onChange={handleChange("panel1")}
            >
              <ExpansionPanelSummary
                // expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography
                  className={classes.heading}
                  color="black"
                  style={{ textAlign: "center" }}
                  gutterBottom
                >
                  <b style={{ color: "#f73378" }}> {element.engagement.type}</b>
                </Typography>
                {element.engagement.type === "TASK" ? (
                  <Typography
                    className={classes.heading}
                    color="black"
                    gutterBottom
                  >
                    {element.metadata.subject}
                  </Typography>
                ) : (
                  <Typography
                    className={classes.heading}
                    color="black"
                    gutterBottom
                  >
                    No Title for the Note
                  </Typography>
                )}
                <Typography
                  className={classes.secondaryHeading}
                  color="black"
                  gutterBottom
                >
                  By: {element.engagement.sourceId}
                </Typography>
                <Typography
                  variant="h8"
                  component="h8"
                  className={classes.heading}
                >
                  {element.engagement.bodyPreview}
                </Typography>
                {/* <Typography
                  variant="h7"
                  component="h7"
                  className={classes.heading}
                >
                  {element.task_name}
                </Typography> */}

                <Typography className={classes.heading}>
                  {" "}
                  <a
                    target="blank"
                    href={element.url}
                    style={{
                      textDecoration: "none",
                      color: "#e84993",
                      fontWeight: "bold",
                    }}
                    size="small"
                  >
                    <LaunchSharpIcon></LaunchSharpIcon>
                  </a>
                </Typography>
                {element.engagement.type === "TASK" ? (
                  <Typography
                    className={classes.heading}
                    color="textSecondary"
                    style={{
                      textDecoration: "none",
                      color: "#e84993",
                      fontWeight: "bold",
                    }}
                    gutterBottom
                  >
                    Priority - {element.metadata.priority}
                  </Typography>
                ) : (
                  <Typography
                    className={classes.heading}
                    color="textSecondary"
                    style={{
                      textDecoration: "none",
                      color: "#e84993",
                      fontWeight: "bold",
                    }}
                    gutterBottom
                  >
                    Priority - NONE
                  </Typography>
                )}
                <Typography
                  className={classes.heading}
                  color="textSecondary"
                  gutterBottom
                >
                  <b>
                    {element.metadata.status === "COMPLETED"
                      ? "Done"
                      : "Pending"}
                  </b>
                </Typography>
                <Button
                  onClick={(event) =>
                    onClickStarHandler(element.is_starred, element, index)
                  }
                  style={{ marginTop: "-10px" }}
                >
                  {element.is_starred ? (
                    <Tooltip
                      style={{ fontWeight: "bold" }}
                      title="Unbookmark ?"
                    >
                      <StarIcon
                        style={{ color: red[400], fontSize: 30 }}
                      ></StarIcon>
                    </Tooltip>
                  ) : (
                    <Tooltip style={{ fontWeight: "bold" }} title="Bookmark ?">
                      <StarBorderIcon style={{ fontSize: 30 }}></StarBorderIcon>
                    </Tooltip>
                  )}
                </Button>
              </ExpansionPanelSummary>
            </ExpansionPanel>
          ):null
        })
      ) : (
        <div className={classesLoader.root}>
          <CircularProgress />
        </div>
      )}
    </React.Fragment>
  );
}

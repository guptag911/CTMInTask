import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

// new Ui
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import LaunchSharpIcon from "@material-ui/icons/LaunchSharp";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import StarIcon from "@material-ui/icons/Star";
import { deleteStarJiraData, saveStarJiraData } from "../api/star";
import { red, blue, yellow } from "@material-ui/core/colors";

import { getJiraDataStatusIncomplete, save_JiraData } from "../api/atlassian";

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
    flexBasis: "20%",
    flexShrink: 0,
    width: "200px",
    marginRight: "2%",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    marginRight: "2%",
    width: "400px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    flexBasis: "80%",
  },
  descpHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}));

export default function SimpleCard(props) {
  const classes = useStyles();
  const [data, getData] = useState(null);
  const classesLoader = useStyleLoader();
  let [Loader, setLoader] = useState(true);
  const [expanded, setExpanded] = React.useState(false);
  let [renderAgain, setRender] = useState(0);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    console.log("in effect");
    setLoader(true);
    getJiraDataStatusIncomplete()
      .then((data) => {
        console.log("data is ", data);
        getData(data);
        setLoader(false);
      })
      .catch((e) => {
        console.log("error is ", e);
        getData(data);
        setLoader(false);
      });
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
      const fdata = deleteStarJiraData("jira", element.issue_id);
    } else {
      element["is_starred"] = true;
      Ndata[index] = element;
      getData(Ndata);
      setRender(renderAgain + 1);
      const data = saveStarJiraData("jira", element);
    }
    const ndata = save_JiraData(element.issue_id, element);
  };




  return (
    <div>
      {data && !Loader ? (
        data.map((element, index) => {
          return (
            <ExpansionPanel
              onMouseOut={MouseLeaveHandler}
              onMouseOver={MouseOverHandler}
              key={element.issue_id}
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <ExpansionPanelSummary
                // expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography
                  className={classes.heading}
                  color="textSecondary"
                  gutterBottom
                >
                  <b style={{ color: "red" }}> {element.project_name}</b>
                </Typography>
                <Typography
                  variant="h8"
                  component="h8"
                  className={classes.heading}
                >
                  {element.issue_name}
                </Typography>
                <Typography
                  variant="h7"
                  component="h7"
                  className={classes.heading}
                >
                  Priority - {element.priority}
                </Typography>
                <Typography className={classes.descpHeading}>
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
                {element.due_date ? (
                  <Typography
                    className={classes.heading}
                    color="textSecondary"
                    gutterBottom
                  >
                    Due Date -{" "}
                    <b style={{ color: "green" }}>{element.due_date}</b>
                  </Typography>
                ) : null}
                <Button
                  onClick={(event) =>
                    onClickStarHandler(element.is_starred, element, index)
                  }
                >
                  {element.is_starred ? (
                    <Tooltip
                      style={{ fontWeight: "bold" }}
                      title="Unbookmark ?"
                    >
                      <StarIcon
                        style={{ color: red[400], fontSize: 40 }}
                      ></StarIcon>
                    </Tooltip>
                  ) : (
                      <Tooltip style={{ fontWeight: "bold" }} title="Bookmark ?">
                        <StarBorderIcon style={{ fontSize: 40 }}></StarBorderIcon>
                      </Tooltip>
                    )}
                </Button>
              </ExpansionPanelSummary>
            </ExpansionPanel>
          );
        })
      ) : (
          <div className={classesLoader.root}>
            <CircularProgress />
          </div>
        )}
    </div>
  );
}

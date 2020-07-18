import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { message_list } from "../api/gmail_reply";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  GsuiteDataGetReplyFalse,
  GmailReplyUpdateData,
} from "../api/gsuiteApi";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Tooltip,
  Button,
} from "@material-ui/core";
import LaunchSharpIcon from "@material-ui/icons/LaunchSharp";
import SearchBar from "./search";

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

let topEmails = {};

export default function SimpleCard(props) {
  const classes = useStyles();
  const [data, getData] = useState(null);
  const classesLoader = useStyleLoader();
  let [Loader, setLoader] = useState(true);
  let [markDone, setMark] = useState(1);
  const [expanded, setExpanded] = React.useState(true);

  const handlePannelChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };

  useEffect(() => {
    // console.log("in useEffect ------------------------------------------------------------------------");
    let userdata = JSON.parse(window.localStorage.getItem("topEmails"));
    topEmails = {};
    for (let data in userdata) {
      topEmails[userdata[data]] = 1;
    }
    // console.log("topEmails is ", topEmails);
    setLoader(true);
    anyNameFunction();
  }, [props.signal]);

  const anyNameFunction = async () => {
    const msgData = await message_list();
    //console.log(msgData);
    GsuiteDataGetReplyFalse()
      .then((data) => {
        // console.log("data is ", data);
        getData(data);
        setLoader(false);
      })
      .catch((e) => {
        console.log("error is ", e);
        getData(data);
        setLoader(false);
      });
  };

  const handleChange = async (id, element) => {
    setLoader(true);
    element.replied = true;
    try {
      const result = await GmailReplyUpdateData(id, element);
      setMark(markDone + 1);
      GsuiteDataGetReplyFalse()
        .then((data) => {
          // console.log("data is ", data);
          getData(data);
          setLoader(false);
        })
        .catch((e) => {
          console.log("error is ", e);
          getData(data);
          setLoader(false);
        });
    } catch (e) {
      console.log("error is ", e);
      setMark(markDone + 1);
    }
  };

  const MouseOverHandler = (e) => {
    e.target.style.background = "rgba(222,222,222,0.8)";
  };
  const MouseLeaveHandler = (e) => {
    e.target.style.background = "white";
  };

  return (
    <div style={{ padding: "30px" }}>
      {data && !Loader ? (
        data.map((element) => {
          return topEmails[element.sender] ? (
            <ExpansionPanel
              onMouseOut={MouseLeaveHandler}
              onMouseOver={MouseOverHandler}
              key={element.thread_id}
              expanded={expanded}
              onChange={handlePannelChange("panel1")}
            >
              <ExpansionPanelSummary
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography
                  className={classes.heading}
                  color="textSecondary"
                  gutterBottom
                >
                  <b style={{ color: "#f73378" }}> {element.sender}</b>
                </Typography>
                <Typography
                  variant="h8"
                  component="h8"
                  className={classes.heading}
                >
                  {element.subject}
                </Typography>
                <Typography
                  variant="h7"
                  component="h7"
                  className={classes.heading}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={element.replied}
                        color="primary"
                        onChange={(e) => {
                          // setChecked(e.target.checked);
                          handleChange(element.thread_id, element);
                        }}
                      />
                    }
                    label="Mark as Done"
                  />
                </Typography>
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

                <Typography
                  className={classes.descpHeading}
                  color="textSecondary"
                  gutterBottom
                >
                  Priority - {element.priority}
                </Typography>
              </ExpansionPanelSummary>
            </ExpansionPanel>
          ) : null;
        })
      ) : (
        <div className={classesLoader.root}>
          <CircularProgress style={{ color: "black" }} />
        </div>
      )}
    </div>
  );
}

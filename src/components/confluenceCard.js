/* eslint-disable jsx-a11y/anchor-is-valid */
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

import { getConfluenceDataStatusIncomplete } from "../api/atlassian";
import ResponsiveDialog from "./dialog";

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
  const [data, getData] = useState([]);
  const classesLoader = useStyleLoader();
  let [Loader, setLoader] = useState(true);
  const [expanded, setExpanded] = React.useState(false);

  // dialog || iframe
  const [open, setOpen] = React.useState(false);
  const [URL, setURL] = React.useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    console.log("in effect");
    setLoader(true);
    getConfluenceDataStatusIncomplete()
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

  const MouseOverHandler = (e) => {
    e.target.style.background = "rgba(222,222,222,0.8)";
  };
  const MouseLeaveHandler = (e) => {
    e.target.style.background = "white";
  };

  const handleClickOpen = (url) => {
    setOpen(true);
    setURL(url);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {data && !Loader ? (
        data.map((element) => {
          return (
            <ExpansionPanel
              onMouseOut={MouseLeaveHandler}
              onMouseOver={MouseOverHandler}
              key={element.task_id}
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
                  <b style={{ color: "red" }}> {element.space_name}</b>
                </Typography>
                <Typography
                  variant="h8"
                  component="h8"
                  className={classes.heading}
                >
                  {element.page_title}
                </Typography>
                <Typography
                  variant="h7"
                  component="h7"
                  className={classes.heading}
                >
                  {element.task_name}
                </Typography>
                <Typography className={classes.descpHeading}>
                  {" "}
                  <a
                    target="blank"
                    style={{
                      textDecoration: "none",
                      color: "#e84993",
                      fontWeight: "bold",
                    }}
                    size="small"
                    onClick={() => handleClickOpen(element.url)}
                  >
                    <LaunchSharpIcon></LaunchSharpIcon>
                  </a>
                </Typography>
                <ResponsiveDialog
                  open={open}
                  handleClose={handleClose}
                  url={URL}
                  element={element}
                />
                {element.due_date ? (
                  <Typography
                    className={classes.heading}
                    color="textSecondary"
                    gutterBottom
                  >
                    Due Date - {element.due_date}
                  </Typography>
                ) : null}
              </ExpansionPanelSummary>
            </ExpansionPanel>

            // <Card key={element.task_id} className={classes.root}>
            //   <CardContent>
            //     <Typography
            //       className={classes.title}
            //       color="textSecondary"
            //       gutterBottom
            //     >
            //       <b style={{ color: "red" }}> Space -- {element.space_name}</b>
            //     </Typography>

            //     <br />
            //     <hr></hr>
            //     <Typography variant="h8" component="h8">
            //       Page Title -- {element.page_title}
            //     </Typography>
            //     <hr></hr>
            //     <br></br>
            //     <Typography variant="h7" component="h7">
            //       {element.task_name}
            //     </Typography>
            //     <br></br>
            //   </CardContent>
            //   <CardActions style={{ float: "left" }}>
            //     <a
            //       target="blank"
            //       href={element.url}
            //       style={{
            //         textDecoration: "none",
            //         color: "#e84993",
            //         fontWeight: "bold",
            //       }}
            //       size="small"
            //     >
            //       Go to the task
            //     </a>
            //   </CardActions>
            //   {element.due_date ? (
            //     <CardActions style={{ float: "right" }}>
            //       <Typography
            //         className={classes.title}
            //         color="textSecondary"
            //         gutterBottom
            //       >
            //         DUE DATE - {element.due_date}
            //       </Typography>
            //     </CardActions>
            //   ) : null}
            // </Card>
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

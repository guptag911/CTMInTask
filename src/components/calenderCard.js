import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
  CalendarDataGet,
  CalendarDataSave,
  get_calendars,
} from "../api/calendarAPI";
import CircularProgress from "@material-ui/core/CircularProgress";
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
      maxWidth: "25%",
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
}));

export default function CalendarCard(props) {
  const classes = useStyles();
  const classesLoader = useStyleLoader();
  let [Loader, setLoader] = useState(true);
  let [data, getData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      get_calendars();
      dataGetCal();
    }, 4000);
  }, []);

  const dataGetCal = async () => {
    const resp = await CalendarDataGet();
    // console.log(resp);
    getData(resp);
    setLoader(false);
  };

  return (
    <React.Fragment>
      <SearchBar getData={getData} service="calendar" />
      {data && !Loader ? (
        data.map((element) => {
          return (
            <Card className={classes.root}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  <b>Created By</b> -- {element.creator}
                </Typography>
                <Typography variant="h7" component="h7">
                  {element.summary}
                </Typography>
                <br />
                <Typography className={classes.pos} color="textSecondary">
                  <b>Event timing</b> -{" "}
                  {new Date(element.start_time).toString()} -{" "}
                  {new Date(element.end_time).toString()}
                </Typography>
                <br></br>
                <Typography className={classes.pos} color="textSecondary">
                  <b>Last Modified</b> - {new Date(element.updated).toString()}
                </Typography>
              </CardContent>
              <CardActions style={{ float: "left" }}>
                <a
                  href={element.htmlLink}
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    color: "#e84993",
                    fontWeight: "bold",
                  }}
                  size="small"
                >
                  Calendar
                </a>
              </CardActions>
              <CardActions style={{ float: "right" }}>
                {element.location ? (
                  <a
                    href={element.location}
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      color: "#e84993",
                      fontWeight: "bold",
                    }}
                    size="small"
                  >
                    Event
                  </a>
                ) : null}
              </CardActions>
            </Card>
          );
        })
      ) : (
        <div className={classesLoader.root}>
          <CircularProgress style={{ color: "#000000" }} />
        </div>
      )}
    </React.Fragment>
  );
}

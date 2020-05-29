import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { CalendarDataGet } from "../api/calendarAPI";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyleLoader = makeStyles((theme) => ({
  root: {
    margin: 200
  },
}));

const useStyles = makeStyles((theme) => ({

  [theme.breakpoints.down('sm')]: {
    root: {
      maxWidth: "100%",
      margin: 20,
      float: "left",
      display: "inline-block",
    },
  },
  [theme.breakpoints.up('sm')]: {
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
  let [Loader, setLoader] = useState(false);
  let [data, getData] = useState(null);

  useEffect(() => {
    setLoader(true);
    CalendarDataGet().then((resp) => {
      getData(resp);
    }).catch((e) => {
      console.log("error is ", e);
    })
  }, []);


  return (
    <React.Fragment>
      {data
        ? data.map((element) => {
          return (
            <Card className={classes.root}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Created By -- {element.creator}
                </Typography>
                <Typography variant="h7" component="h7">
                  {element.summary}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  ad
                  </Typography>
                <Typography variant="body2" component="p">
                  well meaning and kindly.
                    <br />
                  {'"a benevolent smile"'}
                </Typography>
                <br />
                <Typography className={classes.pos} color="textSecondary">
                  Event timing - {new Date(element.start_time).toUTCString()} - {new Date(element.end_time).toUTCString()}
                  </Typography>
                  <br></br>
                  <Typography className={classes.pos} color="textSecondary">
                  Last Modified - {new Date(element.updated).toUTCString()}
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
                {element.location ? <a
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
                  </a> : null}

              </CardActions>
            </Card>)
        }) : <div className={classesLoader.root}>
          <CircularProgress />
        </div>}
    </React.Fragment>
  );
}

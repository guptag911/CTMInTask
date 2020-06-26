import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getConfluenceDataStatusIncomplete } from "../api/atlassian";

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
}));

export default function SimpleCard(props) {
  const classes = useStyles();
  const [data, getData] = useState([]);
  const classesLoader = useStyleLoader();
  let [Loader, setLoader] = useState(true);

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

  return (
    <div>
      {data && !Loader ? (
        data.map((element) => {
          return (
            <Card key={element.task_id} className={classes.root}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  <b style={{ color: "red" }}> Space -- {element.space_name}</b>
                </Typography>

                <br />
                <hr></hr>
                <Typography variant="h8" component="h8">
                  Page Title -- {element.page_title}
                </Typography>
                <hr></hr>
                <br></br>
                <Typography variant="h7" component="h7">
                  {element.task_name}
                </Typography>
                <br></br>
              </CardContent>
              <CardActions style={{ float: "left" }}>
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
                  Go to the task
                </a>
              </CardActions>
              {element.due_date ? (
                <CardActions style={{ float: "right" }}>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    DUE DATE - {element.due_date}
                  </Typography>
                </CardActions>
              ) : null}
            </Card>
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
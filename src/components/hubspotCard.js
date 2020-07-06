import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { HubSpotTasksGetAPIData, HubSpotDataGet } from "../api/hubSpot";

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
  const [data, getData] = useState(null);
  const classesLoader = useStyleLoader();
  let [Loader, setLoader] = useState(true);
  useEffect(() => {
    setLoader(true);
    (async function anyNameFunction() {
      try {
        const data = await HubSpotDataGet();
        console.log("in data ", data);
        getData(data);
        setLoader(false);
      }
      catch (e) {
        console.log("Error is ", e);
        getData([]);
        setLoader(false);
      }
    })();
  }, []);

  return (
    <React.Fragment>
      {data && !Loader ? (
        data.map((element) => {
          return (
            <Card key={element.engagement.id} className={classes.root}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  style={{ textAlign: "center" }}
                  gutterBottom
                >
                  <b style={{ color: "red" }}> {element.engagement.type}</b>
                </Typography>
                <br />
                {element.engagement.type === "TASK" ? (
                  <React.Fragment>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Title -- {element.metadata.subject}
                    </Typography>
                    <br />
                  </React.Fragment>
                ) : null}
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Assigned by -- {element.engagement.sourceId}
                </Typography>

                <br />
                <hr></hr>
                <Typography variant="h8" component="h8">
                  {element.engagement.bodyPreview}
                </Typography>
                <hr></hr>
                <br></br>
                <Typography variant="h7" component="h7">
                  {element.task_name}
                </Typography>
                <br></br>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={element.metadata.status === "COMPLETED"}
                      color="primary"
                    />
                  }
                  label={
                    element.metadata.status === "COMPLETED"
                      ? "COMPLETED"
                      : "UNCOMPLETED"
                  }
                />
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
              {element.engagement.type === "TASK" ? (
                <CardActions style={{ float: "right" }}>
                  <Typography
                    className={classes.title}
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
    </React.Fragment>
  );
}






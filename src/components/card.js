import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { GsuiteDataGet, GsuiteDataSave } from "../api/gsuiteApi";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    maxWidth: "30%",
    margin: 20,
    float: "left",
    display: "inline-block",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard(props) {
  const classes = useStyles();

  // console.log("props is ", props);

  let [data, getData] = useState([]);
  useEffect(() => {
    if (props.data === "gsuite") {
      GsuiteDataGet()
        .then((data) => {
          getData(data);
        })
        .catch((err) => {
          console.log("err is ", err);
        });
    }
  }, []);

  const handleChange = async (mid, element) => {
    try {
      var task = await window.gapi.client.tasks.tasks.get({
        tasklist: "@default",
        task: element.taskid,
      });
      console.log("task is ", task.result);
      task.result["status"] = "completed";
      task.result["hidden"] = true;
      var result = await window.gapi.client.tasks.tasks.update(
        { tasklist: "@default", task: task.result["id"] },
        task.result
      );
      // var result = axios.put('https://www.googleapis.com/tasks/v1/users/@me/lists/MkVoclhyZUZycUtubkNMWQ', {"id": "MkVoclhyZUZycUtubkNMWQ","title": "My task modified again with new tech"});
      console.log("result is ", result.result);
      element.taskid = null;
      element.status = "completed";
      GsuiteDataSave(mid, element).then((data) => {
        GsuiteDataGet().then((resp) => {
          getData(resp);
        });
      });
    } catch (e) {
      console.log("error ", e);
    }
  };

  return (
    <React.Fragment>
      {data
        ? data.map((element) => {
            return !element.taskid && element.status ? null : (
              <Card key={element.mid} className={classes.root}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    Assigned by -- {element.sender}
                  </Typography>
                  <Typography variant="h7" component="h7">
                    {element.task_desc}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    adjective
                  </Typography>
                  <Typography variant="body2" component="p">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!element.taskid && element.status}
                        color="primary"
                        onChange={() => handleChange(element.mid, element)}
                      />
                    }
                    label="Mark as Done"
                  />
                </CardContent>
                <CardActions>
                  <a
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
              </Card>
            );
          })
        : null}
    </React.Fragment>
  );
}

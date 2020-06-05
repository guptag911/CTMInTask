import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { GsuiteDataGet, GsuiteDataSave } from "../api/gsuiteApi";
import CircularProgress from "@material-ui/core/CircularProgress";

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
  const [checked, setChecked] = React.useState(true);
  const classes = useStyles();
  const classesLoader = useStyleLoader();
  let [Loader, setLoader] = useState(false);

  // console.log("props is ", props);

  let [data, getData] = useState(null);
  useEffect(() => {
    console.log("called");
    if (props.product === "gsuites") {
      GsuiteDataGet()
        .then((data) => {
          let ndata = [];
          if (props.data === "gdocs") {
            data.forEach((ele) => {
              if (ele.sender.split("(")[1].split(")")[0] === "Google Docs") {
                ndata.push(ele);
              }
            });
          } else if (props.data === "gslides") {
            data.forEach((ele) => {
              if (ele.sender.split("(")[1].split(")")[0] === "Google Slides") {
                ndata.push(ele);
              }
            });
          } else if (props.data === "gsheets") {
            data.forEach((ele) => {
              if (ele.sender.split("(")[1].split(")")[0] === "Google Sheets") {
                ndata.push(ele);
              }
            });
          }
          getData(ndata);
        })
        .catch((err) => {
          console.log("err is ", err);
        });
    }
  }, []);

  const handleChange = async (mid, element) => {
    setLoader(true);

    if (props.product === "gsuites") {
      try {
        var task = await window.gapi.client.tasks.tasks.get({
          tasklist: "@default",
          task: element.taskid,
        });
        // console.log("task is ", task.result);
        task.result["status"] = "completed";
        task.result["hidden"] = true;
        var result = await window.gapi.client.tasks.tasks.update(
          { tasklist: "@default", task: task.result["id"] },
          task.result
        );
        // var result = axios.put('https://www.googleapis.com/tasks/v1/users/@me/lists/MkVoclhyZUZycUtubkNMWQ', {"id": "MkVoclhyZUZycUtubkNMWQ","title": "My task modified again with new tech"});
        // console.log("result is ", result.result);
        element.taskid = null;
        element.status = "completed";
        GsuiteDataSave(mid, element).then((data) => {
          GsuiteDataGet().then((resp) => {
            let ndata = [];
            if (props.data === "gdocs") {
              resp.forEach((ele) => {
                if (ele.sender.split("(")[1].split(")")[0] === "Google Docs") {
                  ndata.push(ele);
                }
              });
            } else if (props.data === "gslides") {
              resp.forEach((ele) => {
                if (
                  ele.sender.split("(")[1].split(")")[0] === "Google Slides"
                ) {
                  ndata.push(ele);
                }
              });
            } else if (props.data === "gsheets") {
              resp.forEach((ele) => {
                if (
                  ele.sender.split("(")[1].split(")")[0] === "Google Sheets"
                ) {
                  ndata.push(ele);
                }
              });
            }
            getData(ndata);
            // console.log("data is in the card", data);
            setLoader(false);
          });
        });
      } catch (e) {
        console.log("error ", e);
      }
    }
  };

  return (
    <React.Fragment>
      {data && !Loader ? (
        data.map((element) => {
          return !element.taskid && element.status ? null : (
            <Card key={element.mid} className={classes.root}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Assigned by -- {element.sender.split("<")[0]}
                </Typography>
                <Typography variant="h7" component="h7">
                  {element.task_desc}
                </Typography>

                <br />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!element.taskid && element.status}
                      color="primary"
                      onChange={(e) => {
                        setChecked(e.target.checked);
                        handleChange(element.mid, element);
                      }}
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
      ) : (
        <div className={classesLoader.root}>
          <CircularProgress />
        </div>
      )}
    </React.Fragment>
  );
}

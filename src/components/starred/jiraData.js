import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { save_JiraData } from "../../api/atlassian";

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import StarIcon from '@material-ui/icons/Star';
import { getStarJiraData, saveStarJiraData, deleteStarJiraData } from "../../api/star";
import { red, blue, yellow } from '@material-ui/core/colors';

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

  let [renderAgain, setRender] = useState(0);

  useEffect(() => {
    getStarJiraData()
      .then((data) => {
        getData(data);
        setLoader(false);
      })
      .catch((err) => {
        console.log("err is ", err);
        setLoader(false);
      });
  }, []);


  useEffect(() => {
    getData(data);
  }, [renderAgain])


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
          return (element.is_starred ?
            <Card key={element.issue_id} className={classes.root}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Project --{" "}
                  <b style={{ color: "red" }}> {element.project_name}</b>
                </Typography>

                <br />
                <hr></hr>
                <Typography variant="h8" component="h8">
                  Issue -- {element.issue_name}
                </Typography>
                <hr></hr>
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
                    DUE DATE -{" "}
                    <b style={{ color: "green" }}>{element.due_date}</b>
                  </Typography>
                </CardActions>
              ) : null}
              <CardActions style={{ float: "right" }}>
                <Button onClick={(event) => onClickStarHandler(element.is_starred, element, index)}>
                  {element.is_starred ?
                    <Tooltip style={{ fontWeight: "bold" }} title="Unbookmark ?">
                      <StarIcon style={{ color: red[400], fontSize: 40 }}></StarIcon>
                    </Tooltip> : null}
                </Button>
              </CardActions>
            </Card> : null
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
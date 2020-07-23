import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { HubSpotSingleDataSave } from "../../api/hubSpot";

import StarBorderIcon from "@material-ui/icons/StarBorder";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import StarIcon from "@material-ui/icons/Star";
import {
  getStarHubspotData,
  saveStarHubspotData,
  deleteStarHubspotData,
} from "../../api/star";
import { red, blue, yellow } from "@material-ui/core/colors";
import SearchBar from "../search";

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
    getStarHubspotData()
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
  }, [renderAgain]);

  const onClickStarHandler = async (is_starred, element, index) => {
    let Ndata = data;
    if (is_starred) {
      element["is_starred"] = false;
      Ndata[index] = element;
      getData(Ndata);
      setRender(renderAgain + 1);
      const fdata = deleteStarHubspotData(
        "hubspot",
        element.engagement.id.toString()
      );
    } else {
      element["is_starred"] = true;
      Ndata[index] = element;
      getData(Ndata);
      setRender(renderAgain + 1);
      const data = saveStarHubspotData("hubspot", element);
    }
    const ndata = HubSpotSingleDataSave(element);
  };

  return (
    <React.Fragment>
      <SearchBar getData={getData} service="hubstar" />

      {data && !Loader ? (
        data.map((element, index) => {
          return element.is_starred ? (
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
              <CardActions style={{ float: "right" }}>
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
                  ) : null}
                </Button>
              </CardActions>
            </Card>
          ) : null;
        })
      ) : (
        <div className={classesLoader.root}>
          <CircularProgress  style={{ color: "black" }} />
        </div>
      )}
    </React.Fragment>
  );
}

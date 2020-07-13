import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getGsuiteData, saveGsuiteData } from "../api/fixedDb";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import StarIcon from "@material-ui/icons/Star";
import { saveStarGsuiteData, deleteStarGsuiteData } from "../api/star";
import { red, blue, yellow } from "@material-ui/core/colors";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LaunchSharpIcon from "@material-ui/icons/LaunchSharp";
import Popover from "@material-ui/core/Popover";
import SearchBar from "./search";

const useStyleLoader = makeStyles((theme) => ({
  root: {
    margin: 200,
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "20%",
    flexShrink: 0,
    width: "200px",
    marginRight: "2%",
    color: "#f73378",
    fontWeight: "bold",
    fontFamily: "'Nunito Sans', sans-serif",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    marginRight: "2%",
    width: "auto",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    flexBasis: "80%",
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

export default function SimpleCard(props) {
  const [checked, setChecked] = React.useState(true);
  const classes = useStyles();
  const classesLoader = useStyleLoader();
  let [Loader, setLoader] = useState(true);
  let [renderAgain, setRender] = useState(0);
  let [InitRender, setInitRender] = useState(false);
  let [data, getData] = useState(null);
  const [expanded, setExpanded] = React.useState(true);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : true);
  };
  useEffect(() => {
    getGsuiteData()
      .then((data) => {
        getData(data);
        setLoader(false);
        setInitRender(InitRender + 1);
      })
      .catch((err) => {
        console.log("err is ", err);
        setLoader(false);
        setInitRender(InitRender + 1);
      });
  }, []);

  useEffect(() => {
    getData(data);
  }, [renderAgain]);

  const MouseOverHandler = (e) => {
    e.target.style.background = "rgba(222,222,222,0.8)";
  };
  const MouseLeaveHandler = (e) => {
    e.target.style.background = "white";
  };

  const handleMarkDoneChange = async (comment_id, element) => {
    setLoader(true);

    if (props.product === "gsuites") {
      try {
        element.status = "resolved";
        await saveGsuiteData(comment_id, element);
        const resp = await getGsuiteData();
        getData(resp);
        setLoader(false);
      } catch (e) {
        console.log("error ", e);
      }
    }
  };

  const onClickStarHandler = async (is_starred, element, index) => {
    let Ndata = data;
    if (is_starred) {
      element["is_starred"] = false;
      Ndata[index] = element;
      getData(Ndata);
      setRender(renderAgain + 1);
      const fdata = deleteStarGsuiteData("gsuite", element);
    } else {
      element["is_starred"] = true;
      Ndata[index] = element;
      getData(Ndata);
      setRender(renderAgain + 1);
      const data = saveStarGsuiteData("gsuite", element);
    }
    const ndata = saveGsuiteData(element.comment_id, element);
  };

  console.log("data and newdata from props are ", data, props.newData);

  return (
    <React.Fragment>
      <SearchBar getData={getData} service="Gsuite" />
      {data && !Loader ? (
        data.map((element, index) => {
          return element.status === "open" ? (
            <ExpansionPanel
              onMouseOut={MouseLeaveHandler}
              onMouseOver={MouseOverHandler}
              key={element.comment_id}
              expanded={expanded}
              onChange={handleChange("panel1")}
            >
              <ExpansionPanelSummary
                // expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className={classes.heading}>
                  {element.sender.split("<")[0]}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  {element.task_desc}
                </Typography>
                <Typography className={classes.descpHeading}>
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
                <Button
                  onClick={(event) =>
                    onClickStarHandler(element.is_starred, element, index)
                  }
                  style={{ marginTop: "-20px" }}
                >
                  {element.is_starred ? (
                    <Tooltip
                      style={{ fontWeight: "bold" }}
                      title="Unbookmark ?"
                    >
                      <StarIcon
                        style={{ color: red[400], fontSize: 30 }}
                      ></StarIcon>
                    </Tooltip>
                  ) : (
                      <Tooltip style={{ fontWeight: "bold" }} title="Bookmark ?">
                        <StarBorderIcon style={{ fontSize: 30 }}></StarBorderIcon>
                      </Tooltip>
                    )}
                </Button>
              </ExpansionPanelSummary>
            </ExpansionPanel>
          ) : null;
        })
      ) : (
          <div className={classesLoader.root}>
            <CircularProgress />
          </div>
        )}
    </React.Fragment>
  );
}

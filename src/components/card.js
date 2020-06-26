import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import { GsuiteDataGet, GsuiteDataSave } from "../api/gsuiteApi";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getGsuiteData, saveGsuiteData } from "../api/fixedDb";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LaunchSharpIcon from "@material-ui/icons/LaunchSharp";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";

const useStyleLoader = makeStyles((theme) => ({
  root: {
    margin: 200,
    verticalAlign: "middle",
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  fab: {
    margin: theme.spacing(2),
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
    width: "auto",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    flexBasis: "70%",
  },
  descpHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    marginRight: "2%",
  },
}));

export default function SimpleCard(props) {
  const [checked, setChecked] = React.useState(true);
  // const classes = useStyles();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const classesLoader = useStyleLoader();
  let [Loader, setLoader] = useState(true);

  // console.log("props is ", props);

  let [data, getData] = useState(null);
  useEffect(() => {
    getGsuiteData()
      .then((data) => {
        console.log(data);
        getData(data);
        setLoader(false);
      })
      .catch((err) => {
        console.log("err is ", err);
        setLoader(false);
      });
  }, []);

  const handleChangeCheck = async (comment_id, element) => {
    setLoader(true);
    try {
      element.status = "resolved";
      await saveGsuiteData(comment_id, element);
      const resp = await getGsuiteData();
      getData(resp);
      setLoader(false);
    } catch (e) {
      console.log("error ", e);
    }
  };

  return (
    <React.Fragment>
      {data && !Loader ? (
        data.map((element) => {
          return element.status === "open" ? (
            // <Button>
            <ExpansionPanel
              key={element.comment_id}
              expanded={expanded === "panel1"}
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
                <Tooltip title="Mark as Done" aria-label="Mark Done">
                  {/* <Fab color="primary" className={classes.fab}> */}
                  <Checkbox
                    checked={element.status === "resolved"}
                    color="primary"
                    onChange={(e) => {
                      setChecked(e.target.checked);
                      handleChangeCheck(element.comment_id, element);
                    }}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                  {/* </Fab> */}
                </Tooltip>
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

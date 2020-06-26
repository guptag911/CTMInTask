import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import { GsuiteDataGet, GsuiteDataSave } from "../api/gsuiteApi";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getGsuiteData, saveGsuiteData } from "../api/fixedDb";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LaunchSharpIcon from '@material-ui/icons/LaunchSharp';

const useStyleLoader = makeStyles((theme) => ({
  root: {
    margin: 200,
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '10%',
    flexShrink: 0,
    width: "200px",
    marginRight: "2%"
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    marginRight: "2%",
    width: "400px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  descpHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
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

  // const handleChange = async (comment_id, element) => {
  //   setLoader(true);

  //   if (props.product === "gsuites") {
  //     try {
  //       element.status = "resolved";
  //       await saveGsuiteData(comment_id, element);
  //       const resp = await getGsuiteData();
  //       let ndata = [];
  //       if (props.data === "gdocs") {
  //         resp.forEach((ele) => {
  //           if (ele.sender.includes("Google Docs")) {
  //             ndata.push(ele);
  //           }
  //         });
  //       } else if (props.data === "gslides") {
  //         resp.forEach((ele) => {
  //           if (ele.sender.includes("Google Slides")) {
  //             ndata.push(ele);
  //           }
  //         });
  //       } else if (props.data === "gsheets") {
  //         resp.forEach((ele) => {
  //           if (ele.sender.includes("Google Sheets")) {
  //             ndata.push(ele);
  //           }
  //         });
  //       }
  //       getData(ndata);
  //       setLoader(false);
  //     } catch (e) {
  //       console.log("error ", e);
  //     }
  //   }
  // };

  return (
    <React.Fragment>
      {data && !Loader ? (
        data.map((element) => {
          return element.status === "open" ? (

            <ExpansionPanel key={element.comment_id} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className={classes.heading}>{element.sender.split("<")[0]}</Typography>
                <Typography className={classes.secondaryHeading}>{element.task_desc}</Typography>
                <Typography className={classes.descpHeading}> <a
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
                </a></Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                  maximus est, id dignissim quam.
          </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>

            // <Card key={element.comment_id} className={classes.root}>
            //   <CardContent>
            //     <Typography
            //       className={classes.title}
            //       color="textSecondary"
            //       gutterBottom
            //     >
            //       Assigned by -- {element.sender.split("<")[0]}
            //     </Typography>
            //     <Typography variant="h7" component="h7">
            //       {element.task_desc}
            //     </Typography>

            //     <br />
            //     <FormControlLabel
            //       control={
            //         <Checkbox
            //           checked={element.status === "resolved"}
            //           color="primary"
            //           onChange={(e) => {
            //             setChecked(e.target.checked);
            //             handleChange(element.comment_id, element);
            //           }}
            //         />
            //       }
            //       label="Mark as Done"
            //     />
            //   </CardContent>
            //   <CardActions>
            //     <a
            //       target="blank"
            //       href={element.url}
            //       style={{
            //         textDecoration: "none",
            //         color: "#e84993",
            //         fontWeight: "bold",
            //       }}
            //       size="small"
            //     >
            //       Go to the task
            //     </a>
            //   </CardActions>
            // </Card>
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

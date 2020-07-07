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
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import StarIcon from '@material-ui/icons/Star';
import { getStarGsuiteData,saveStarGsuiteData } from "../api/star";
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
  const [checked, setChecked] = React.useState(true);
  const classes = useStyles();
  const classesLoader = useStyleLoader();
  let [Loader, setLoader] = useState(true);

  // console.log("props is ", props);

  let [data, getData] = useState(null);
  useEffect(() => {
      getStarGsuiteData()
        .then((data) => {
          getData(data);
          setLoader(false);
        })
        .catch((err) => {
          console.log("err is ", err);
          setLoader(false);
        });
  }, []);

  const handleChange = async (comment_id, element) => {
    setLoader(true);

    if (props.product === "gsuites") {
      try {
        element.status = "resolved";
        await saveGsuiteData(comment_id, element);
        const resp = await getStarGsuiteData();
        getData(resp);
        setLoader(false);
      } catch (e) {
        console.log("error ", e);
      }
    }
  };


  const onClickHandler = async (event, element) => {
    element["is_starred"]=true;
    const data = await saveStarGsuiteData("gsuite", element);
    const ndata = await saveGsuiteData(element.comment_id, element);
  }



  return (
    <React.Fragment>
      {data && !Loader ? (
        data.map((element) => {
          return element.status === "open" ? (
            <Card key={element.comment_id} className={classes.root}>
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
              <CardActions style={{ float: "right" }}>

                <Button onClick={(event) => onClickHandler(event, element)}>
                  {element.is_starred ?
                    <Tooltip style={{ fontWeight: "bold" }} title="Unbookmark ?">
                      <StarIcon style={{color:red[400], fontSize:40}}></StarIcon>
                    </Tooltip> :
                    <Tooltip style={{ fontWeight: "bold" }} title="Bookmark ?">
                      <StarBorderIcon style={{fontSize:40}}></StarBorderIcon>
                    </Tooltip>}
                </Button>
              </CardActions>

            </Card>
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

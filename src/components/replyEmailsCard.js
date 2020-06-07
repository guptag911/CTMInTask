import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { message_list } from "../api/gmail_reply";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GsuiteDataGetReplyFalse } from "../api/gsuiteApi";

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

let topEmails ={};

export default function SimpleCard(props) {
  const classes = useStyles();
  const [data, getData] = useState(null);
  const classesLoader = useStyleLoader();
  let [Loader, setLoader] = useState(true);

  useEffect(() => {
    // console.log("in useEffect ------------------------------------------------------------------------");
    let userdata = JSON.parse(window.localStorage.getItem("topEmails"));
    topEmails={};
    for(let data in userdata){
      topEmails[userdata[data]]=1;
    }
    // console.log("topEmails is ", topEmails);
    setLoader(true);
    (async function anyNameFunction() {
      const msgData = await message_list();
      GsuiteDataGetReplyFalse().then((data) => {
        // console.log("data is ", data);
        getData(data);
        setLoader(false);
      }).catch((e) => {
        console.log("error is ", e);
        getData(data);
        setLoader(false);
      })

    })();

  }, [props.signal])


  return (
    <div>
      {data && !Loader ? (
        data.map((element) => {
          return topEmails[element.sender] ? (<Card key={element.mid} className={classes.root}>
            <CardContent>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                Mailed by -- {element.sender}
                </Typography>
              <Typography variant="h7" component="h7">
                {element.subject}
              </Typography>

              <br />
            </CardContent>
            <CardActions>
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
          </Card>
          ):null
        })
      ) : (
          <div className={classesLoader.root}>
            <CircularProgress />
          </div>
        )}
    </div>
  );
}
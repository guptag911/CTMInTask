import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { getGsuiteData } from "../api/fixedDb";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  getAnalyticsGsuiteData,
  getAnalyticsCompletedGsuiteData,
} from "../api/analytics";
import { get_JiraData, get_confluenceData } from "../api/atlassian";
import { HubSpotDataGet } from "../api/hubSpot";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

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

export default function ChartFunc() {
  const [loader, setLoader] = useState(true);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [recentData, setRecentData] = useState(0);
  const [recentChart, setRecentChart] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    (async function anyNameFunction() {
      try {
        const Rdata = await getAnalyticsGsuiteData();
        const Tdata = await getAnalyticsCompletedGsuiteData();
        console.log("data is ", Rdata.length, Tdata.length);
        setRecentData(Rdata.length + Tdata.length);
        setRecentChart({
          labels: ["Completed Tasks", "Recently Completed Tasks"],
          datasets: [
            {
              label: "Tasks",
              backgroundColor: ["#2979ff", "#00bcd4"],
              borderColor: "rgba(255,255,255,1)",
              borderWidth: 1,
              data: [Tdata.length, Rdata.length, 0],
            },
          ],
        });
        setTimeout(() => {
          setLoader(false);
        }, 500);
      } catch (e) {
        console.log("Error is ", e);
        setLoader(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async function anyNameFunction() {
      try {
        const data = await getGsuiteData();
        // SetGsuiteData(data);
        // console.log("Data in analytics is ", data);
        let pendTasks = 0;
        let compTasks = 0;
        let totTasks = data.length;
        for (let ele in data) {
          if (data[ele].status === "resolved") {
            compTasks += 1;
          } else if (data[ele].status === "open") {
            pendTasks += 1;
          }
        }
        setPendingTasks(pendingTasks + pendTasks);
        setTotalTasks(totalTasks + totTasks);
        setCompletedTasks(completedTasks + compTasks);
        let Hubdata = await HubSpotDataGet();
        // console.log("Data hub ", Hubdata);
        for (let ele in Hubdata) {
          if (
            Hubdata[ele].engagement.type === "TASK" &&
            Hubdata[ele].metadata.status === "COMPLETED"
          ) {
            compTasks += 1;
            totTasks += 1;
          } else if (
            Hubdata[ele].engagement.type === "TASK" &&
            Hubdata[ele].metadata.status !== "COMPLETED"
          ) {
            pendTasks += 1;
            totTasks += 1;
          }
        }

        let Jiradata = await get_JiraData();
        totTasks += Jiradata.length;
        for (let ele in Jiradata) {
          if (Jiradata[ele].status === "complete") {
            compTasks += 1;
          } else if (Jiradata[ele].status === "incomplete") {
            pendTasks += 1;
          }
        }

        let Confdata = await get_confluenceData();
        totTasks += Confdata.length;
        for (let ele in Confdata) {
          if (Confdata[ele].status === "complete") {
            compTasks += 1;
          } else if (Confdata[ele].status === "incomplete") {
            pendTasks += 1;
          }
        }

        setChartData({
          labels: ["Pending Tasks", "Completed Tasks", "Total Tasks"],
          datasets: [
            {
              label: "Tasks",
              backgroundColor: ["#ff6d00", "#e91e63", "#ffd000"],
              borderColor: "rgba(255,255,255,1)",
              borderWidth: 1,
              data: [pendTasks, compTasks, totTasks, 0],
            },
          ],
        });
        setTimeout(() => {
          setLoader(false);
        }, 500);
      } catch (e) {
        console.log("Error is ", e);
        setLoader(false);
      }
    })();
  }, []);

  const [contRecent, setContRecent] = React.useState(null);
  const [contTask, setCont] = React.useState(null);

  const onClickEventHandler = (e) => {
    // console.log("event is ", e);
    if (e.length) {
      if (e[0]._index == 2) {
        setCont("Total Task clicked");
      } else if (e[0]._index == 1) {
        setCont("Completed Tasks clicked");
      } else if (e[0]._index == 0) {
        setCont("Pending Tasks clicked");
      }
    }
  };

  const onClickRecentHandler = (e) => {
    // console.log("event is ", e);
    if (e.length) {
      if (e[0]._index == 0) {
        setContRecent("Completed Task clicked in recent chart");
      } else if (e[0]._index == 1) {
        setContRecent("Recent Completed Tasks clicked in recent chart");
      }
    }
  };

  return (
    <React.Fragment>
      {!loader ? (
        <Card className={classes.root}>
          <CardContent>
            <Doughnut
              data={chartData}
              onElementsClick={(e) => onClickEventHandler(e)}
              options={{
                cutoutPercentage: 65,
                responsive: true,
                title: {
                  display: true,
                  text: "Tasks Analytics",
                  fontSize: 20,
                },
                legend: {
                  display: true,
                  position: "right",
                },
              }}
            />
            {/* {contTask ? <React.Fragment>{contTask}</React.Fragment> : null} */}
          </CardContent>
        </Card>
      ) : (
        <CircularProgress style={{ color: "black" }} />
      )}
      <Card className={classes.root}>
        <CardContent>
          {recentData > 0 ? (
            <Doughnut
              data={recentChart}
              onElementsClick={(e) => onClickRecentHandler(e)}
              options={{
                cutoutPercentage: 65,
                responsive: true,
                title: {
                  display: true,
                  text: "Recent Tasks Analytics",
                  fontSize: 20,
                },
                legend: {
                  display: true,
                  position: "right",
                },
              }}
            />
          ) : (
            "No Recent Task Completed"
          )}
          {/* {contRecent ? <React.Fragment>{contRecent}</React.Fragment> : null} */}
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

import React, { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  getAnalyticsHubspotData,
  getAnalyticsCompletedHubspotData,
  getAnalyticsMonthHubspotData,
} from "../../api/analytics";
import { HubSpotDataGet } from "../../api/hubSpot";
import { makeStyles } from "@material-ui/core/styles";
import { ResponsivePie } from "@nivo/pie";
import Grid from "@material-ui/core/Grid";

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
  const [chartData, setChartData] = useState(null);
  const [recentChart, setRecentChart] = useState(null);
  const classes = useStyles();
  const [avgTime, setTimeFunc] = useState(null);

  useEffect(() => {
    (async function anyNameFunction() {
      try {
        const Rdata = await getAnalyticsHubspotData();
        const Tdata = await getAnalyticsCompletedHubspotData();
        const Mdata = await getAnalyticsMonthHubspotData();
        console.log("data is ", Rdata.length, Tdata.length);
        setTimeFunc([
          {
            id: "Last 7 days",
            label: "Last 7 days avg time(hours) per task",
            value: Math.round((7*24 / Rdata.length + Number.EPSILON) * 100) / 100,
            color: "hsl(257, 70%, 50%)",
          },
          {
            id: "Last 30 days",
            label: "Last 30 days avg time(hours) per task",
            value: Math.round((30*24/ Mdata.length + Number.EPSILON) * 100) / 100,
            color: "hsl(169, 70%, 50%)",
          },
        ]);
        setRecentChart([
          {
            id: "Completed",
            label: "Completed Tasks",
            value: Tdata.length,
            color: "hsl(169, 70%, 50%)",
          },
          {
            id: "Recently Completed",
            label: "Recently Completed Tasks",
            value: Rdata.length,
            color: "hsl(257, 70%, 50%)",
          },
        ]);
        setLoader(false);
      } catch (e) {
        console.log("Error is ", e);
        setLoader(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async function anyNameFunction() {
      try {
        let pendTasks = 0;
        let compTasks = 0;
        let totTasks = 0;

        let Hubdata = await HubSpotDataGet();
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

        setChartData([
          {
            id: "Pending",
            label: "Pending Tasks",
            value: pendTasks,
            color: "hsl(169, 70%, 50%)",
          },
          {
            id: "Completed",
            label: "Completed Tasks",
            value: compTasks,
            color: "hsl(257, 70%, 50%)",
          },
          {
            id: "Total",
            label: "Total Tasks",
            value: totTasks,
            color: "hsl(241, 70%, 50%)",
          },
        ]);
        setLoader(false);
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
    console.log("event is ", e);
    if (e.length) {
      if (e[0]._index == 0) {
        setContRecent("Completed Task clicked in recent chart");
      } else if (e[0]._index == 1) {
        setContRecent("Recent Completed Tasks clicked in recent chart");
      }
    }
  };

  const MyResponsivePie = ({ data }) =>
    data ? (
      <ResponsivePie
        data={data}
        width={250}
        height={250}
        onClick={onClickRecentHandler}
        innerRadius={0.6}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: "nivo" }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        enableRadialLabels={false}
      />
    ) : null;

  return (
    <React.Fragment>
      <Grid container spacing={0} style={{ margin: "0 auto !important" }}>
        <Grid item xs>
          {!loader ? (
            chartData ? (
              <div
                className={classes.root}
                style={{ width: "300px", height: "300px" }}
              >
                <MyResponsivePie data={chartData} />
              </div>
            ) : null
          ) : (
            <CircularProgress />
          )}
        </Grid>
        <Grid item xs>
          {recentChart ? (
            <div
              className={classes.root}
              style={{ width: "300px", height: "300px" }}
            >
              <MyResponsivePie data={recentChart}></MyResponsivePie>
            </div>
          ) : null}
        </Grid>
        <Grid item xs>
          {avgTime ? (
            <div
              className={classes.root}
              style={{ width: "300px", height: "300px" }}
            >
              <MyResponsivePie data={avgTime}></MyResponsivePie>
            </div>
          ) : null}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

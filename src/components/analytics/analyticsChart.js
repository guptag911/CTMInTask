import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { getGsuiteData } from "../../api/fixedDb";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  getAnalyticsOverallCompletedData,
  getAnalyticsOverallCompletedDataRecently,
  getAnalyticsOverallCompletedDataMonth,
} from "../../api/analytics";
import { get_JiraData, get_confluenceData } from "../../api/atlassian";
import { HubSpotDataGet } from "../../api/hubSpot";
import { makeStyles } from "@material-ui/core/styles";
import { ResponsivePie } from "@nivo/pie";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";

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

const useStylesDate = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
    padding: "20px !important",
  },
}));

let currDate = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;

export default function ChartFunc(props) {
  const [loader, setLoader] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [recentChart, setRecentChart] = useState(null);
  const classes = useStyles();
  const [avgTime, setTimeFunc] = useState(null);
  const [isfinitTime, setFinite] = useState(true);
  const classesdate = useStylesDate();

  const [fromDate7, setFromDate7] = React.useState(
    new Date().getTime() - 7 * 24 * 3600 * 1000
  );
  const [fromDate30, setFromDate30] = React.useState(
    new Date().getTime() - 30 * 24 * 3600 * 1000
  );
  const [toDate, setToDate] = React.useState(new Date().getTime());

  const FromHandler = (e) => {
    // console.log("val is ", e.target.value, new Date(e.target.value).getTime());
    setFromDate7(new Date(e.target.value).getTime());
    setFromDate30(new Date(e.target.value).getTime());
  };

  const ToHandler = (e) => {
    console.log("val is in ToHandler ", e.target.value);
    setToDate(new Date(e.target.value).getTime());
  };

  useEffect(() => {
    (async function anyNameFunction() {
      try {
        const Rdata = await getAnalyticsOverallCompletedDataRecently(
          fromDate7,
          toDate
        );
        const Tdata = await getAnalyticsOverallCompletedData();
        const Mdata = await getAnalyticsOverallCompletedDataMonth(
          fromDate30,
          toDate
        );
        console.log("data is ", Rdata.length, Tdata.length, Mdata);
        if (Rdata.length == 0 || Mdata.length == 0) {
          setFinite(false);
        } else {
          setFinite(true);
          setTimeFunc([
            {
              id: "Last 7 days",
              label: "Last 7 days avg time(hours) per task",
              value:
                Math.round(
                  ((toDate - fromDate7) / (Rdata.length * 3600 * 1000) +
                    Number.EPSILON) *
                    100
                ) / 100,
              color: "hsl(257, 70%, 50%)",
            },
            {
              id: "Last 30 days",
              label: "Last 30 days avg time(hours) per task",
              value:
                Math.round(
                  ((toDate - fromDate30) / (Mdata.length * 3600 * 1000) +
                    Number.EPSILON) *
                    100
                ) / 100,
              color: "hsl(169, 70%, 50%)",
            },
          ]);
        }
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
        // setTimeout(() => {
        setLoader(false);
        // }, 500);
      } catch (e) {
        console.log("Error is ", e);
        setLoader(false);
      }
    })();
  }, [fromDate7, fromDate30, toDate]);

  useEffect(() => {
    (async function anyNameFunction() {
      try {
        const data = await getGsuiteData();
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
        // setTimeout(() => {
        setLoader(false);
        // }, 500);
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

  const graphdata = [
    {
      id: "stylus",
      label: "stylus",
      value: 179,
      color: "hsl(169, 70%, 50%)",
    },
    {
      id: "php",
      label: "php",
      value: 25,
      color: "hsl(257, 70%, 50%)",
    },
    {
      id: "rust",
      label: "rust",
      value: 478,
      color: "hsl(241, 70%, 50%)",
    },
    {
      id: "hack",
      label: "hack",
      value: 65,
      color: "hsl(185, 70%, 50%)",
    },
    {
      id: "go",
      label: "go",
      value: 181,
      color: "hsl(260, 70%, 50%)",
    },
  ];

  const MyResponsivePie = ({ data }) =>
    data ? (
      <ResponsivePie
        data={data}
        width={250}
        height={250}
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Container>
            <form className={classesdate.container} noValidate>
              <TextField
                id="date"
                label="From"
                type="date"
                defaultValue={currDate}
                onChange={FromHandler}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="date"
                label="To"
                type="date"
                onChange={ToHandler}
                defaultValue={toDate}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </Container>
        </Grid>
      </Grid>

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
          {avgTime && isfinitTime ? (
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

import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { getGsuiteData } from "../../api/fixedDb";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAnalyticsGsuiteData, getAnalyticsCompletedGsuiteData } from "../../api/analytics";
import { get_JiraData, get_confluenceData } from "../../api/atlassian";
import { HubSpotDataGet } from "../../api/hubSpot";
import { makeStyles } from "@material-ui/core/styles";
import { ResponsivePie } from '@nivo/pie'

import TreeDropDown from "./dropdown";



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

        setRecentChart([
          {
            "id": "Completed",
            "label": "Completed Tasks",
            "value": Tdata.length,
            "color": "hsl(169, 70%, 50%)"
          },
          {
            "id": "Recently Completed",
            "label": "Recently Completed Tasks",
            "value": Rdata.length,
            "color": "hsl(257, 70%, 50%)"
          }
        ])
        setLoader(false);
      } catch (e) {
        console.log("Error is ", e);
        setLoader(false);
      }
    })();
  }, [])




  useEffect(() => {
    (async function anyNameFunction() {
      try {
        
        let Confdata = await get_confluenceData();
        let pendTasks = 0;
        let compTasks = 0;
        let totTasks = Confdata.length;
        for (let ele in Confdata) {
          if (Confdata[ele].status === "complete") {
            compTasks += 1;
          } else if (Confdata[ele].status === "incomplete") {
            pendTasks += 1;
          }
        }
        setChartData(
          [
            {
              "id": "Pending",
              "label": "Pending Tasks",
              "value": pendTasks,
              "color": "hsl(169, 70%, 50%)"
            },
            {
              "id": "Completed",
              "label": "Completed Tasks",
              "value": compTasks,
              "color": "hsl(257, 70%, 50%)"
            },
            {
              "id": "Total",
              "label": "Total Tasks",
              "value": totTasks,
              "color": "hsl(241, 70%, 50%)"
            }
          ]

        )
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
    // console.log("event is ", e);
    if (e.length) {
      if (e[0]._index == 0) {
        setContRecent("Completed Task clicked in recent chart");
      }
      else if (e[0]._index == 1) {
        setContRecent("Recent Completed Tasks clicked in recent chart");
      }
    }
  }




  const MyResponsivePie = ({ data }) => (
    data ?
      <ResponsivePie
        data={data}
        width={500}
        height={500}
        margin={{ top: 40, right: 150, bottom: 80, left: 150 }}
        innerRadius={0.6}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      />
      : null
  )








  return (
    <React.Fragment>
      {!loader ? (
        chartData ?
          <div className={classes.root} style={{ width: 700, height: 500 }}>
            <MyResponsivePie
              data={chartData}
            />
          </div> : null) : (
          <CircularProgress />
        )}
      {recentData > 0 ?
        <div className={classes.root} style={{ width: 700, height: 600, marginLeft:100 }}>
          <MyResponsivePie
            data={recentChart}>
          </MyResponsivePie>
        </div> : null}
    </React.Fragment>
  );
}
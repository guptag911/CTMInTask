import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { getGsuiteData } from "../api/fixedDb";
import CircularProgress from "@material-ui/core/CircularProgress";
import { HubSpotDataGet } from "../api/hubSpot";
import { get_JiraData, get_confluenceData } from "../api/atlassian";

export default function ChartFunc() {
  const [loader, setLoader] = useState(true);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [chartData, setChartData] = useState(null);

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
              backgroundColor: ["rgba(200,00,00,0.8)", "rgba(00,200,00, 0.8)", "rgba(00,00,200,0.8)"],
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 2,
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



  const [cont, setCont] = React.useState(null);

  const onClickEventHandler = (e) => {
    // console.log("event is ", e);
    if (e.length) {
      if (e[0]._index == 2) {
        setCont("Total Task clicked");
      }
      else if (e[0]._index == 1) {
        setCont("Completed Tasks clicked");
      }
      else if (e[0]._index == 0) {
        setCont("Pending Tasks clicked");
      }
    }
  }

  return (
    <div>
      {!loader ? (
        <Doughnut
          data={chartData}
          onElementsClick={(e) => onClickEventHandler(e)}
          options={{
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
      ) : (
          <CircularProgress />
        )}
      {cont ?
        <React.Fragment>
          {cont}
        </React.Fragment> : null
      }
    </div>
  );
}

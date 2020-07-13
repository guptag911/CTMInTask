import React, { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAnalyticsJiraData, getAnalyticsCompletedJiraData, getAnalyticsMonthJiraData } from "../../api/analytics";
import { get_JiraData } from "../../api/atlassian";
import { makeStyles } from "@material-ui/core/styles";
import { ResponsivePie } from '@nivo/pie'


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
                const Rdata = await getAnalyticsJiraData();
                const Tdata = await getAnalyticsCompletedJiraData();
                const Mdata = await getAnalyticsMonthJiraData();
                console.log("data is ", Rdata.length, Tdata.length, Mdata);
                setTimeFunc([
                    {
                        "id": "Last 7 days",
                        "label": "Last 7 days avg task per day",
                        "value": Math.round(((Rdata.length / 7) + Number.EPSILON) * 100) / 100,
                        "color": "hsl(257, 70%, 50%)"
                    },
                    {
                        "id": "Last 30 days",
                        "label": "Last 30 days avg task per day",
                        "value": Math.round(((Mdata.length / 30) + Number.EPSILON) * 100) / 100,
                        "color": "hsl(169, 70%, 50%)"
                    }
                ])
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
                // setTimeout(() => {
                setLoader(false);
                // }, 500);
            } catch (e) {
                console.log("Error is ", e);
                setLoader(false);
            }
        })();
    }, [])




    useEffect(() => {
        (async function anyNameFunction() {
            try {
                let Jiradata = await get_JiraData();
                let pendTasks = 0;
                let compTasks = 0;
                let totTasks = Jiradata.length;
                for (let ele in Jiradata) {
                    if (Jiradata[ele].status === "complete") {
                        compTasks += 1;
                    } else if (Jiradata[ele].status === "incomplete") {
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
                margin={{ top: 40, right: 150, bottom: 40, left: 150 }}
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
                    <div className={classes.root} style={{ width: 700, height: 300 }}>
                        <MyResponsivePie
                            data={chartData}
                        />
                    </div> : null) : (
                    <CircularProgress />
                )}
            {recentChart ?
                <div className={classes.root} style={{ width: 700, height: 300, marginLeft: 100 }}>
                    <MyResponsivePie
                        data={recentChart}>
                    </MyResponsivePie>
                </div> : null}
            {avgTime ? <div className={classes.root} style={{ width: 700, height: 400, marginLeft: 100 }}>
                <MyResponsivePie
                    data={avgTime}>
                </MyResponsivePie>
            </div> : null}
        </React.Fragment>
    );
}

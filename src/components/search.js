import React, { useState, useEffect } from "react";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import GsuiteCard from "./card";
import { getGsuiteData } from "../api/fixedDb";
import {
  getJiraDataStatusIncomplete,
  getConfluenceDataStatusIncomplete,
} from "../api/atlassian";
import { HubSpotDataGet } from "../api/hubSpot";
import { CalendarDataGet } from "../api/calendarAPI";
import { GsuiteDataGetReplyFalse } from "../api/gsuiteApi";
import {
  getStarConfluenceData,
  getStarHubspotData,
  getStarJiraData,
  getStarGsuiteData,
} from "../api/star";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "40%",
    },
    border: "2px solid grey",
    margin: "0 auto !important",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "80%",
    },
    borderRadius: "10px",
    boxShadow: "0 4px 48px 0 rgba(0, 0, 0, 0.2)",
    padding: "4px 48px 0 64px !important",
    height: "50px",
  },
}));

export default function SearchBar({ getData, service }) {
  const theme = useTheme();
  const classes = useStyles();
  const [val, setVal] = React.useState(null);

  const filterData = async (data) => {
    console.log(data);
    let filtData = data.filter((obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          if (val && obj[key].toLowerCase().includes(val.toLowerCase())) {
            return obj;
          }
        }
      }
    });
    return filtData;
  };

  const HubspotfilterData = async (data) => {
    console.log(data);
    let filtData = data.filter((obj) => {
      for (const key in obj) {
        // console.log("key is ", key, obj[key]);
        for (const key2 in obj[key]) {
          if (typeof obj[key][key2] === "string") {
            if (val && obj[key][key2].toLowerCase().includes(val.toLowerCase())) {
              return obj;
            }
          }
        }
      }
    });
    return filtData;
  };

  // Input Search
  const handleInput = async (e) => {
    e.preventDefault();
    e.persist();
    setVal(e.target.value);
    if (service === "Gsuite") {
      const data = await getGsuiteData();
      const newData = await filterData(data);
      getData(newData);
    } else if (service === "jira") {
      const data = await getJiraDataStatusIncomplete();
      const newData = await filterData(data);
      getData(newData);
    } else if (service === "confluence") {
      const data = await getConfluenceDataStatusIncomplete();
      const newData = await filterData(data);
      getData(newData);
    } else if (service === "hubspot") {
      const data = await HubSpotDataGet();
      const newData = await HubspotfilterData(data);
      getData(newData);
    } else if (service === "calendar") {
      const data = await CalendarDataGet();
      const newData = await filterData(data);
      getData(newData);
    } else if (service === "reply") {
      const data = await GsuiteDataGetReplyFalse();
      const newData = await filterData(data);
      getData(newData);
    } else if (service === "gsuitestar") {
      const data = await getStarGsuiteData();
      const newData = await filterData(data);
      getData(newData);
    } else if (service === "jirastar") {
      const data = await getStarJiraData();
      const newData = await filterData(data);
      getData(newData);
    } else if (service === "hubstar") {
      const data = await getStarHubspotData();
      const newData = await HubspotfilterData(data);
      getData(newData);
    } else if (service === "confstar") {
      const data = await getStarConfluenceData();
      const newData = await filterData(data);
      getData(newData);
    }

    console.log(val);
  };

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
        onChange={(e) => handleInput(e)}
      />
    </div>
  );
}

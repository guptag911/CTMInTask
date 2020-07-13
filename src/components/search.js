import React, { useState, useEffect } from "react";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import GsuiteCard from "./card";
import { getGsuiteData } from "../api/fixedDb";

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
  },
}));

export default function SearchBar({ setShowData }) {
  const theme = useTheme();
  const classes = useStyles();
  const [val, setVal] = React.useState(null);

  const filterData = async (data) => {
    console.log(data);
    let filtData = data.filter((obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          if (obj[key].includes(val)) {
            return obj;
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
    const data = await getGsuiteData();
    setVal(e.target.value);
    const newData = await filterData(data);
    console.log("new data is ", newData);
    setShowData(<GsuiteCard newData={newData}></GsuiteCard>);
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

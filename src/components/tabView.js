import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GsuiteCard from "./card";
import ConfluenceCard from "./confluenceCard";
import HubSpotCard from "./hubspotCard";
import JiraCard from "./jiraCard";
import StarCard from "./stardataCard";
import AnalyticsCard from "./analyticsChart";
import CalendarCard from "./calenderCard";
import ReplyMailCard from "./replyEmailsCard";
import { ReactAutosuggestExample } from "./reactAutoSuggest";
import { firebaseAuth } from "../config/config";
import { Button } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";
import Profile from "./profile";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { auth, getToken } from "../helper/confAuth";
import { getUserToken } from "../helper/confUserAuth";
import { hubAuth, getHubToken } from "../helper/hubAuth";
import { jiraAuth, getJiraToken } from "../helper/jiraAuth";
import Avatar from "@material-ui/core/Avatar";
import RefreshIcon from "@material-ui/icons/Refresh";
import { user } from "../helper/confUserAuth";
import ConfStarCard from "./starred/confluenceData";
import JiraStarCard from "./starred/jiraData";
import HubStarCard from "./starred/hubspotData";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },

  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const userstore = JSON.parse(sessionStorage.getItem("user"));

  // nav
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  // navbarMobile
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (e) => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Profile />
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar alt="click" src={user.photoURL} />
        </IconButton>
        <p style={{ color: "#000000 !important" }}>Profile</p>
      </MenuItem>
    </Menu>
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  let [contents, setShowData] = React.useState(<GsuiteCard></GsuiteCard>);

  // auth connect

  const [value, setValue] = React.useState(0);

  const [authState, setAuthSate] = React.useState(
    JSON.parse(localStorage.getItem("token"))
  );
  const [hubState, setHubState] = React.useState(
    JSON.parse(localStorage.getItem("hub"))
  );

  const [jiraState, setJiraState] = React.useState(
    JSON.parse(localStorage.getItem("jira"))
  );

  const [clickState, setclickState] = React.useState(
    JSON.parse(localStorage.getItem("state")) || {
      hub: false,
      conf: false,
      Jira: false,
      user: false,
    }
  );

  let state = {
    hub: false,
    conf: false,
    Jira: false,
    user: false,
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleState = (e) => {
    e.preventDefault();
    if (!window.localStorage.getItem("token")) {
      alert(
        'Connect to confluence and then Click the "Identify Yourself" button to identify yourself'
      );
    } else if (
      window.localStorage.getItem("token") &&
      !window.localStorage.getItem("user")
    ) {
      alert('Click the "Identify Yourself" button to identify yourself');
    }
  };

  const handleReq = async (e) => {
    state = {
      hub: false,
      conf: true,
      Jira: false,
      user: false,
    };
    localStorage.setItem("state", JSON.stringify(state));

    const res = await auth();
    window.location.href = res;
  };

  const handleHub = async (e) => {
    state = {
      hub: true,
      conf: false,
      Jira: false,
      user: false,
    };
    localStorage.setItem("state", JSON.stringify(state));

    const res = await hubAuth();
    console.log(res);
    window.location.href = res;
  };

  const handleJira = async (e) => {
    state = {
      hub: false,
      conf: false,
      Jira: true,
      user: false,
    };
    localStorage.setItem("state", JSON.stringify(state));
    const res = await jiraAuth();
    window.location.href = res;
  };

  const handleUserAuth = async (e) => {
    let state = {
      hub: false,
      conf: false,
      Jira: false,
      user: true,
    };
    localStorage.setItem("state", JSON.stringify(state));
    const res = await user();
    window.location.href = res;
  };

  const params = new URLSearchParams(window.location.search);
  const authCode = params.get("code");
  setTimeout(() => {
    if (clickState.hub && authCode) {
      window.location.reload(false);
      state = {
        hub: false,
        conf: false,
        Jira: false,
        user: false,
      };
      localStorage.setItem("state", JSON.stringify(state));
    }

    if (clickState.Jira && authCode) {
      window.location.reload(false);
      state = {
        hub: false,
        conf: false,
        Jira: false,
        user: false,
      };
      localStorage.setItem("state", JSON.stringify(state));
    }

    if (clickState.conf && authCode) {
      window.location.reload(false);
      state = {
        hub: false,
        conf: false,
        Jira: false,
        user: false,
      };
      localStorage.setItem("state", JSON.stringify(state));
    }

    if (clickState.user && authCode) {
      window.location.reload(false);
      state = {
        hub: false,
        conf: false,
        Jira: false,
        user: false,
      };
      localStorage.setItem("state", JSON.stringify(state));
    }
  }, 4000);

  React.useEffect(() => {
    if (clickState.hub) {
      handleHubAuth();
    } else if (clickState.Jira) {
      handleJiraAuth();
    } else if (clickState.conf) {
      handleAuth();
    } else if (clickState.user) {
      handleUser();
    }
  }, [window.onload]);

  const handleAuth = async () => {
    await getToken();
  };

  const handleUser = async () => {
    await getUserToken();
  };

  const handleJiraAuth = async () => {
    await getJiraToken();
  };

  const handleHubAuth = async () => {
    await getHubToken();
  };

  const [anchorEl1, setAnchorEl1] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl1(null);
  };

  const onClickShow = (event, service) => {
    handleClose();

    switch (service) {
      case "Gsuite":
        setShowData(<GsuiteCard></GsuiteCard>);
        break;
      case "Hubspot":
        firebaseAuth.currentUser && !hubState
          ? setShowData(
              <Button
                variant="contained"
                color="primary"
                className={classes.center}
                onClick={handleHub}
              >
                Connect to HubSpot
              </Button>
            )
          : setShowData(<HubSpotCard></HubSpotCard>);
        break;
      case "Confluence":
        firebaseAuth.currentUser && !authState
          ? setShowData(
              <Button
                variant="contained"
                color="primary"
                className={classes.center}
                onClick={handleReq}
              >
                Connect to Confluence
              </Button>
            )
          : setShowData(<ConfluenceCard></ConfluenceCard>);
        break;
      case "Jira":
        firebaseAuth.currentUser && !jiraState
          ? setShowData(
              <Button
                variant="contained"
                color="primary"
                className={classes.center}
                onClick={handleJira}
              >
                Connect to Jira
              </Button>
            )
          : setShowData(<JiraCard></JiraCard>);
        break;
      case "Calendar":
        setShowData(<CalendarCard></CalendarCard>);
        break;
      case "Reply Mail":
        setShowData(
          <React.Fragment>
            <ReactAutosuggestExample></ReactAutosuggestExample>
            <ReplyMailCard></ReplyMailCard>
          </React.Fragment>
        );
        break;
      case "Analytics":
        setShowData(<AnalyticsCard></AnalyticsCard>);
        break;
      case "gsuitestar":
        setShowData(<StarCard></StarCard>);
        break;
      case "confstar":
        setShowData(<ConfStarCard></ConfStarCard>);
        break;
      case "hubstar":
        setShowData(<HubStarCard></HubStarCard>);
        break;
      case "jirastar":
        setShowData(<JiraStarCard></JiraStarCard>);
        break;
      default:
        setShowData(<GsuiteCard></GsuiteCard>);
    }
  };

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <img
              src="https://innovaccer.com/static/image/site-logo/innovaccer-logo-black.svg"
              alt="Innovaccer"
            />
          </Typography>
          <div className={classes.grow} />
          <IconButton
            color="inherit"
            style={{ marginRight: "20px" }}
            onClick={refreshPage}
          >
            <RefreshIcon style={{ width: "1.5em", height: "1.5em" }} />
          </IconButton>
          {firebaseAuth.currentUser && !window.localStorage.getItem("user") ? (
            <Button
              variant="contained"
              color="inherit"
              onClick={handleUserAuth}
              style={{ fontWeight: "bold" }}
            >
              Identify Yourself
            </Button>
          ) : null}
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar alt="click" src={userstore.photoURL} />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="#000000"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <span
            style={{ fontSize: "20px", color: "black", fontWeight: "bold" }}
          >
            Browse by Category
          </span>
          <IconButton
            onClick={handleDrawerClose}
            style={{ paddingLeft: "5px" }}
          >
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {[
            "Gsuite",
            "Hubspot",
            "Jira",
            "Confluence",
            "Calendar",
            "Reply Mail",
          ].map((text, index) => (
            <ListItem
              button
              key={text}
              onClick={(event) => onClickShow(event, text)}
            >
              <ListItemIcon>
                {index === 0 ? (
                  <img src="https://img.icons8.com/cute-clipart/40/google-logo.png"></img>
                ) : index === 1 ? (
                  <img src="https://img.icons8.com/windows/40/hubspot.png"></img>
                ) : index === 2 ? (
                  <img src="https://img.icons8.com/color/40/jira.png"></img>
                ) : index === 3 ? (
                  <img src="https://img.icons8.com/windows/40/confluence.png"></img>
                ) : index === 4 ? (
                  <img src="https://img.icons8.com/cute-clipart/40/calendar.png"></img>
                ) : (
                  <img src="https://img.icons8.com/fluent/40/gmail.png"></img>
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["Analytics", "Starred"].map((text, index) => (
            <ListItem
              button
              key={text}
              onClick={
                text === "Starred" ? null : (event) => onClickShow(event, text)
              }
            >
              <ListItemIcon>
                {index === 0 ? (
                  <img src="https://img.icons8.com/fluent/40/web-analystics.png"></img>
                ) : (
                  <React.Fragment>
                    <Button
                      style={{ marginLeft: -10 }}
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <img src="https://img.icons8.com/cute-clipart/40/bookmark-ribbon.png"></img>
                    </Button>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl1}
                      keepMounted
                      open={Boolean(anchorEl1)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={(e) => onClickShow(e, "gsuitestar")}>
                        Gsuite
                      </MenuItem>
                      <MenuItem onClick={(e) => onClickShow(e, "jirastar")}>
                        Jira
                      </MenuItem>
                      <MenuItem onClick={(e) => onClickShow(e, "confstar")}>
                        Confluence
                      </MenuItem>
                      <MenuItem onClick={(e) => onClickShow(e, "hubstar")}>
                        Hubspot
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {contents}
      </main>
    </div>
  );
}

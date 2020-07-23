import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Button,
  IconButton,
  Avatar,
  Tooltip,
  Toolbar,
  CssBaseline,
  AppBar,
  Menu,
  MenuItem,
  makeStyles,
  fade,
} from "@material-ui/core";
import { firebaseAuth, db } from "../../config/config";
import ResponsiveDialog from "./dialog";
import MoreIcon from "@material-ui/icons/MoreVert";
import Profile from "../profile";
import clsx from "clsx";
import { Link } from "react-router-dom";

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
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
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

const Admin = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState(null);
  const [currentUid, setCurrentUid] = useState(null);
  const classes = useStyles();
  const userstore = JSON.parse(sessionStorage.getItem("user"));

  // nav
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const finalObj = [];

  const handleClickOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentUid(e.currentTarget.parentNode.parentNode.className);
    setOpen(true);
  };
  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  useEffect(() => {
    getAllUsersFromDb();
  }, []);

  const getAllUsersFromDb = async () => {
    const data = await db.collection("users").get();
    data.forEach((data) => {
      finalObj.push({
        name: data.data().name,
        email: data.data().email,
        uid: data.id,
        url: data.data().photoUrl,
      });
    });
    setUsers(finalObj);
  };

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
          <Avatar alt="click" src={userstore.photoURL} />
        </IconButton>
        <p style={{ color: "#000000 !important" }}>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <Typography variant="h6" noWrap>
                <img
                  src="https://innovaccer.com/static/image/site-logo/innovaccer-logo-black.svg"
                  alt="Innovaccer"
                />
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                style={{ fontWeight: "bold" }}
                component={Link}
                to="/dash"
                style={{ marginLeft: "30px" }}
              >
                HOME
              </Button>
              <div className={classes.grow} />
              <Button
                variant="outlined"
                color="inherit"
                style={{ fontWeight: "bold" }}
              >
                ADMIN
              </Button>
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
        </Grid>
        <Grid item xs style={{ padding: "80px" }}>
          <Typography
            variant="h3"
            gutterBottom
            style={{ color: "#e84993", fontWeight: "bold" }}
          >
            Admin Dashboard
          </Typography>
          <Typography variant="h4" gutterBottom>
            <strong>
              ({JSON.parse(sessionStorage.getItem("user")).displayNam})
            </strong>{" "}
            ({JSON.parse(sessionStorage.getItem("user")).email})
          </Typography>
        </Grid>
        <Grid item xs style={{ padding: "80px" }}>
          {users
            ? users.map((obj) => {
                return (
                  <div key={obj.uid} className={obj.uid}>
                    <Typography variant="h5" gutterBottom>
                      <IconButton
                        edge="end"
                        aria-haspopup="true"
                        color="inherit"
                        style={{ padding: "20px" }}
                      >
                        <Avatar alt="avatar" src={obj.url} />
                      </IconButton>
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleClickOpen}
                        style={{ textTransform: "initial" }}
                      >
                        <strong>({obj.name})</strong> {obj.email}
                      </Button>
                    </Typography>
                  </div>
                );
              })
            : null}
          <ResponsiveDialog
            open={open}
            handleClose={handleClose}
            uid={currentUid}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Admin;

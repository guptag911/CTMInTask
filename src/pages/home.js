import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { signout, signIn } from "../helper/auth";
import { firebaseAuth } from "../config/config";
import { Link } from "react-router-dom";
import { DataSave } from "../api/datagetting_pythonScript";
import { auth, getToken } from "../helper/confAuth";
import { Route, Redirect } from "react-router-dom";

const style = {
  width: "100px",
  height: "20px",
};
const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authUrl, setAuthUrl] = useState("");
  const [authState, setAuthSate] = useState(
    JSON.parse(localStorage.getItem("token"))
  );

  async function fetchData() {
    const res = await auth();
    setAuthUrl(res);
    return res;
  }

  const handleUser = async (e) => {
    if (currentUser) {
      await signout();
    } else {
      await signIn();
    }
  };

  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
      return user;
    } else {
      setCurrentUser(null);
      return null;
    }
  });

  const handleReq = async (e) => {
    const res = await fetchData();
    window.location.href = res;
  };

  const handleToken = async (e) => {
    await getToken();
  };

  return (
    <div className="center">
      <h1>Presenting</h1>
      <h2>InTask - Your Personal Central Task Manager</h2>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUser}
        className="btn"
      >
        {currentUser ? (
          <h4 style={style}>Sign Out</h4>
        ) : (
          <div id="customBtn">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google"
              width="25px"
              style={{ paddingTop: "10px", paddingLeft: "10px" }}
            />
            <span className="buttonText">Log in with Google</span>
          </div>
        )}
      </Button>
      {currentUser ? (
        <Button
          className="btn"
          variant="contained"
          color="secondary"
          component={Link}
          to="/dash"
          style={{ margin: "5px", width: "200px", height: "75px" }}
          onClick={handleToken}
        >
          <b>Go to Dashboard</b>
        </Button>
      ) : null}
      {currentUser &&
      !authState &&
      (currentUser.email === "abhilnm011@gmail.com" ||
        currentUser.email === "abhishek.tiwari@innovaccer.com") ? (
        <Button
          className="btn"
          variant="contained"
          color="secondary"
          style={{ margin: "5px", width: "200px", height: "75px" }}
          onClick={handleReq}
        >
          <b>Authorize Confluence</b>
        </Button>
      ) : null}
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { signout, signIn } from "../helper/auth";
import { firebaseAuth } from "../config/config";
import { Link } from "react-router-dom";
import { DataSave } from "../api/datagetting_pythonScript";
import {TestAuth} from "../helper/test";

const style = {
  width: "100px",
  height: "20px",
};
const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleUser = async (e) => {
    if (currentUser) {
      await signout();
      window.sessionStorage.clear();
      window.localStorage.clear();
    } else {
      await signIn();
    }
  };

  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
      window.sessionStorage.setItem(
        "user",
        JSON.stringify(user.providerData[0])
      );
      return user;
    } else {
      setCurrentUser(null);
      return null;
    }
  });

  useEffect(()=>{
    TestAuth();
  }, [])

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
        >
          <b>Go to Dashboard</b>
        </Button>
      ) : null}
    </div>
  );
};

export default Home;

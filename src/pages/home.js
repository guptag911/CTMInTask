import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { signout, signIn } from "../helper/auth";
import { firebaseAuth } from "../config/config";
import { Link } from "react-router-dom";

const style = {
  width: "100px",
  height: "20px",
};
const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleUser = async (e) => {
    if (currentUser) {
      console.log(currentUser);
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
          <h4 style={style}>Sign In</h4>
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

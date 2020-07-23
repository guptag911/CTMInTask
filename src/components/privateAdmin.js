import React from "react";
import { Route, Redirect } from "react-router-dom";
import { firebaseAuth } from "../config/config";

const PrivateAdmin = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        (window.sessionStorage.getItem("user") || firebaseAuth.currentUser) &&
        JSON.parse(window.sessionStorage.getItem("user")).isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateAdmin;

import React from "react";
import { Route, Redirect } from "react-router-dom";
import { firebaseAuth } from "../config/config";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        window.sessionStorage.getItem("user") || firebaseAuth.currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateRoute;

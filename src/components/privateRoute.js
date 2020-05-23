import React from "react";
import { Route, Redirect } from "react-router-dom";
import {
    firebaseAuth
} from "../config/config";


const PrivateRoute = ({
    Component: Component,
    ...rest
}) => (
        <Route
            {...rest}
            render={(props) =>
                firebaseAuth.currentUser ? <Component {...props} /> : <Redirect to="/" />
            }
        />
    );

export default PrivateRoute;


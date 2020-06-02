import React from "react";
import { Route, Redirect } from "react-router-dom";
import {
    firebaseAuth
} from "../config/config";



const PrivateRoute = ({
    component: Component,
    ...rest
}) => {
    console.log("current user is ",firebaseAuth.currentUser);
    return (
        <Route
            {...rest}
            render={(props) =>
                window.localStorage.getItem("firebase:authUser:AIzaSyAaQHOvz_m-PBJa2QFhCuT82aIzFc2ZQVI:[DEFAULT]") ? <Component {...props} /> : <Redirect to="/" />
            }
        />
    )
}

export default PrivateRoute;


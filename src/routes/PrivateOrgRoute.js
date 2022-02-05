import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import isAdmin from "../components/services/isAdmin";

const PrivateOrgRoute = ({ component: Component, ...rest }) => {
  useEffect(() => {
    isAdmin();
  }, []);
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route {...rest} render={(props) => <Component {...props} />} />
  );
};

export default PrivateOrgRoute;

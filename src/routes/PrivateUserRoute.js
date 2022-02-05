import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import isUser from "../components/services/isUser";

const PrivateUserRoute = ({ component: Component, ...rest }) => {
  useEffect(() => {
    isUser();
  }, []);

  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route {...rest} render={(props) => <Component {...props} />} />
  );
};

export default PrivateUserRoute;

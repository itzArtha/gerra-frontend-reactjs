import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateOrgRoute = ({ component: Component, ...rest }) => {
  const isAuth = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        isAuth && role === "0" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateOrgRoute;

import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../components/views/user/Home";
import App from "../components/views/organization/layouts/App";
import Login from "../components/auth/Login";
import OnBoarding from "../components/auth/OnBoarding";
import PrivateUserRoute from "./PrivateUserRoute";
import PrivateOrgRoute from "./PrivateOrgRoute";
import Register from "../components/auth/Register";
import ResetPassword from "../components/auth/ResetPassword";
import SetResetPassword from "../components/auth/SetResetPassword";
import EmailVerification from "../components/auth/EmailVerification";
import CompleteProfile from "../components/views/organization/CompleteProfile";
import SearchEvent from "../components/views/user/SearchEvent";
import SearchOrganization from "../components/views/user/SearchOrganization";
import EventDetail from "../components/views/user/EventDetail";
import ManageEvent from "../components/views/organization/ManageEvent";

const Router = () => {
  return (
    <React.Fragment>
      <Switch>
        <PrivateUserRoute path="/" exact component={Home} />
        <PrivateUserRoute path="/explore/event" exact component={SearchEvent} />
        <PrivateUserRoute
          path="/explore/organization"
          exact
          component={SearchOrganization}
        />
        <PrivateOrgRoute
          path="/complete-profile"
          exact
          component={CompleteProfile}
        />
        <PrivateOrgRoute
          path="/manage/event/:slug"
          exact
          component={ManageEvent}
        />
        <PrivateOrgRoute path="/admin/:router" exact component={App} />

        <Route path="/explore/event/:slug" exact component={EventDetail} />
        <Route path="/verifikasi-email" exact component={EmailVerification} />
        <Route path="/login" exact component={OnBoarding} />
        <Route path="/:id/register" exact component={Register} />
        <Route path="/:id/login" exact component={Login} />
        <Route path="/forget-password" exact component={ResetPassword} />
        <Route path="/password/reset" exact component={SetResetPassword} />
      </Switch>
    </React.Fragment>
  );
};

export default Router;

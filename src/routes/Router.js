import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../components/views/user/Home";
import App from "../components/views/organization/layouts/App";
import Login from "../components/auth/Login";
import OnBoarding from "../components/auth/OnBoarding";
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
import PublicProfileView from "../components/views/organization/PublicProfileView";
import Dashboard from "../components/views/user/Profile/Dashboard";
import Payment from "../components/views/user/Payment";
import Tickets from "../components/views/user/Tickets";
import Notif from "../components/views/user/notifications/Dashboard";
import PrivateUserRoute from "./PrivateUserRoute";
import EventAdmin from "../components/views/organization/events/components/App";
import OverlayPresensi from "../components/views/organization/events/OverlayPresensi";

const Router = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route path="/login" exact component={OnBoarding} />
        <PrivateOrgRoute
          path="/complete-profile"
          exact
          component={CompleteProfile}
        />
        <PrivateUserRoute path="/" exact component={Home} />
        <PrivateUserRoute path="/profile/:router" exact component={Dashboard} />
        <PrivateUserRoute path="/explore/event" exact component={SearchEvent} />
        <PrivateUserRoute path="/payment" exact component={Payment} />
        <PrivateUserRoute path="/tickets/:router" exact component={Tickets} />
        <PrivateUserRoute
          path="/notifications/:router"
          exact
          component={Notif}
        />
        <PrivateUserRoute
          path="/explore/organization"
          exact
          component={SearchOrganization}
        />

        <Route path="/:username" exact component={PublicProfileView} />

        <PrivateOrgRoute
          path="/manage/event/:slug"
          exact
          component={ManageEvent}
        />
        <PrivateOrgRoute
          path="/admin/event/:slug"
          exact
          component={EventAdmin}
        />
        <PrivateOrgRoute path="/admin/:router" exact component={App} />

        <Route path="/overlay/:slug" exact component={OverlayPresensi} />
        <Route path="/explore/event/:slug" exact component={EventDetail} />
        <Route path="/verifikasi-email" exact component={EmailVerification} />
        <Route path="/:id/register" exact component={Register} />
        <Route path="/:id/login" exact component={Login} />
        <Route path="/forget-password" exact component={ResetPassword} />
        <Route path="/password/reset" exact component={SetResetPassword} />
      </Switch>
    </React.Fragment>
  );
};

export default Router;

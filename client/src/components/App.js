import React from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Messenger from "./Messenger";
import { AuthRoute, ProtectedRoute } from "../util/route";

export default () => (
  <>
    <Route exact path="/" component={Home} />
    <AuthRoute path="/login" component={Login} />
    <AuthRoute path="/signup" component={Signup} />
    <ProtectedRoute path="/messenger" component={Messenger} />
  </>
);

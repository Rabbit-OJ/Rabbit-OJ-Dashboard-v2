import React from "react";

import UserLogin from "./Login";
import UserRegister from "./Register";

import { Route, Switch, Redirect } from "react-router-dom";
import Paper from "@material-ui/core/Paper";

const User = () => {
  const isLogin = false; // todo

  return (
    <Paper>
      <Switch>
        {isLogin && <Redirect to="/submission/list/1" />}
        <Route
          path="/user/login"
          component={UserLogin}
        />
        <Route
          path="/user/register"
          component={UserRegister}
        />
      </Switch>
    </Paper>
  );
};

export default User;

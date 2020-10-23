import React from "react";

import UserLogin from "./Login";
import UserRegister from "./Register";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import { Route, Switch, Redirect } from "react-router-dom";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(() =>
  createStyles({
    inputContainer: {
      "@media screen and (min-width: 800px)": {
        padding: "48px 20%",
      },
      "@media screen and (max-width: 800px)": {
        padding: "48px 10%",
      },
    },
  })
);

const User = () => {
  const isLogin = false; // todo

  const classes = useStyles();
  return (
    <Paper className={classes.inputContainer}>
      <Switch>
        {isLogin && <Redirect to="/submission/list/1" />}
        <Route path="/user/login" component={UserLogin} />
        <Route path="/user/register" component={UserRegister} />
      </Switch>
    </Paper>
  );
};

export default User;

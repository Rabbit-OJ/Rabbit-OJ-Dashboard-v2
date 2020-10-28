import React, { useState } from "react";
import { useHistory } from "react-router";

import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import RabbitFetch from "../../utils/fetch";
import API_URL from "../../utils/url";
import passwordMD5 from "../../utils/password";
import { GeneralResponse } from "../../model/general-response";

const useStyles = makeStyles(() =>
  createStyles({
    btnContainer: {
      display: "flex",
      justifyContent: "center",
      flexFlow: "column",
    },
    btnMargin: {
      margin: "12px",
    },
    fullWidth: {
      width: "100%",
      margin: "24px 0",
    },
    inputTitle: {
      textAlign: "center",
      userSelect: "none",
    },
  })
);

const UserRegister = () => {
  const classes = useStyles();
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    history.push("/user/login");
  };
  const handleRegister = async () => {
    const response = await RabbitFetch<GeneralResponse>(
      API_URL.USER.POST_REGISTER,
      {
        method: "POST",
        body: {
          username: username,
          password: passwordMD5(password),
          email: email,
        },
      }
    );
  };

  return (
    <form>
      <h3 className={classes.inputTitle}>Register</h3>
      <TextField
        className={classes.fullWidth}
        placeholder="Username"
        name="username"
      />
      <TextField
        className={classes.fullWidth}
        placeholder="Email"
        name="mail"
      />
      <TextField
        className={classes.fullWidth}
        placeholder="Password"
        type="password"
        name="password"
      />
      <TextField
        className={classes.fullWidth}
        placeholder="Repeat Password"
        type="password"
        name="password_repeat"
      />
      <div className={classes.btnContainer}>
        <Button
          variant="contained"
          className={classes.btnMargin}
          id="register"
          color="primary"
          onClick={handleRegister}
        >
          Register
        </Button>
        <Button
          className={classes.btnMargin}
          id="login"
          color="secondary"
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
    </form>
  );
};

export default UserRegister;

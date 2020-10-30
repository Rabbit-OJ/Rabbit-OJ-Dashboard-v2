import React, { useCallback, useState } from "react";
import { useHistory } from "react-router";

import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import RabbitFetch from "../../utils/fetch";
import passwordMD5 from "../../utils/password";
import API_URL from "../../utils/url";
import { GeneralResponse } from "../../model/general-response";
import { LoginResponse } from "../../model/login-response";
import { emitSnackbar } from "../../data/emitter";
import { useDispatch } from "react-redux";
import { login } from "../../data/actions";

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

const UserLogin = () => {
  const classes = useStyles();
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = useCallback(async () => {
    const { code, message } = await RabbitFetch<GeneralResponse<LoginResponse>>(
      API_URL.USER.POST_LOGIN,
      {
        method: "POST",
        body: {
          username: username,
          password: passwordMD5(password),
        },
      }
    );

    if (code === 200) {
      history.push("/list/problem/1");
      dispatch(login({ ...message }));
      localStorage.setItem("token", message.token);
      emitSnackbar("Login success!", { variant: "success" });
    } else {
      emitSnackbar(message, { variant: "error" });
    }
  }, [history, dispatch, username, password]);
  const handleRegister = useCallback(() => {
    history.push("/user/register");
  }, [history]);
  const handlePasswordKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        handleLogin();
      }
    },
    [handleLogin]
  );

  return (
    <form>
      <h3 className={classes.inputTitle}>Login</h3>
      <TextField
        className={classes.fullWidth}
        placeholder="Username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        className={classes.fullWidth}
        placeholder="Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handlePasswordKeydown}
      />
      <div className={classes.btnContainer}>
        <Button
          variant="contained"
          className={classes.btnMargin}
          id="login"
          color="primary"
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button
          className={classes.btnMargin}
          id="register"
          color="secondary"
          onClick={handleRegister}
        >
          Register
        </Button>
      </div>
    </form>
  );
};

export default UserLogin;

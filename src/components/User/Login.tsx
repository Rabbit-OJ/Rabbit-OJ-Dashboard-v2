import React from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() =>
  createStyles({
    btnContainer: {
      display: "flex",
      justifyContent: "center",
    },
    btnMargin: {
      margin: "12px",
    },
    fullWidth: {
      width: "100%",
      margin: "24px 0"
    },
    inputTitle: {
      textAlign: "center",
      userSelect: "none",
    },
  })
);

const UserLogin = () => {
  const classes = useStyles();

  const handleLogin = () => {};
  const handleRegister = () => {};

  return (
    <form>
      <h3 className={classes.inputTitle}>Login</h3>
      <TextField
        className={classes.fullWidth}
        placeholder="Username"
        name="username"
      />
      <TextField
        className={classes.fullWidth}
        placeholder="Password"
        type="password"
        name="password"
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
          variant="contained"
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

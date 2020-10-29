import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { OptionsObject, SnackbarMessage, useSnackbar } from "notistack";

import makeStyles from "@material-ui/core/styles/makeStyles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";

import MenuIcon from "@material-ui/icons/Menu";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";
import ListIcon from "@material-ui/icons/List";
import ForumIcon from "@material-ui/icons/Forum";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import BackupIcon from "@material-ui/icons/Backup";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { loadingDec, loadingInc, logout } from "../../data/actions";
import { useTypedSelector } from "../../data";
import { loadingEmitter, snackbarEmitter } from "../../data/emitter";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
}));

const Bar = () => {
  const classes = useStyles();
  const [navigationOpenState, setNavigationOpenState] = React.useState(false);
  const history = useHistory();

  const { isLogin, username, loadingCount } = useTypedSelector((state) => ({
    isLogin: state.user.isLogin,
    username: state.user.username,
    loadingCount: state.loading.loadingCount,
  }));
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    console.log(1);
    const loadingEvent = (arg: -1 | 1) => {
      if (arg === -1) {
        dispatch(loadingDec());
      } else {
        dispatch(loadingInc());
      }
    };
    loadingEmitter.addListener("data", loadingEvent);

    const snackbarEvent = (
      message: SnackbarMessage,
      options?: OptionsObject
    ) => {
      enqueueSnackbar(message, options);
    };
    snackbarEmitter.addListener("data", snackbarEvent);

    return () => {
      loadingEmitter.removeListener("data", loadingEvent);
      snackbarEmitter.removeListener("data", snackbarEvent);
    };
  }, [dispatch, enqueueSnackbar]);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setNavigationOpenState(open);
  };

  const NavigationList = () => {
    return (
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <ListItem button onClick={() => history.push("/list/problem/1")}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Problems" />
          </ListItem>
          <ListItem button onClick={() => history.push("/list/contest/1")}>
            <ListItemIcon>
              <EmojiEventsIcon />
            </ListItemIcon>
            <ListItemText primary="Contest" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ForumIcon />
            </ListItemIcon>
            <ListItemText primary="Community" />
          </ListItem>
        </List>
        <Divider />
        <List>
          {!isLogin && (
            <>
              <ListItem button onClick={() => history.push("/user/login")}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>

              <ListItem button onClick={() => history.push("/user/register")}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItem>
            </>
          )}
          {isLogin && (
            <>
              <ListItem
                button
                onClick={() => history.push("/list/submission/1")}
              >
                <ListItemIcon>
                  <BackupIcon />
                </ListItemIcon>
                <ListItemText primary="Submission" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  if (window.confirm("Sure to log out?")) {
                    localStorage.removeItem("token");
                    dispatch(logout());
                  }
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          )}
        </List>
      </div>
    );
  };

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          onClick={toggleDrawer(true)}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="left"
          open={navigationOpenState}
          onClose={toggleDrawer(false)}
        >
          <NavigationList />
        </Drawer>
        <Typography variant="h6" className={classes.title}>
          Rabbit OJ v2
        </Typography>
        {!isLogin && (
          <Button
            color="inherit"
            onClick={() => {
              history.push("/user/login");
            }}
          >
            Login
          </Button>
        )}
        {isLogin && (
          <Button
            color="inherit"
            onClick={() => {
              if (window.confirm("Sure to log out?")) {
                localStorage.removeItem("token");
                dispatch(logout());
              }
            }}
          >
            {username}
          </Button>
        )}
      </Toolbar>
      {loadingCount > 0 && <LinearProgress />}
    </AppBar>
  );
};

export default Bar;

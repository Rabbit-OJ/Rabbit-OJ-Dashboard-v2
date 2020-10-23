import React from "react";

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

import MenuIcon from "@material-ui/icons/Menu";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import ListIcon from '@material-ui/icons/List';
import ForumIcon from '@material-ui/icons/Forum';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';

import makeStyles from "@material-ui/core/styles/makeStyles";

import { useHistory } from "react-router";

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
    const history = useHistory();

    return (
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <ListItem button onClick={() => history.push("/list/1")}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Problems" />
          </ListItem>
          <ListItem button onClick={() => history.push("/contest/list/1")}>
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
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Bar;

import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Provider } from "react-redux";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import orange from "@material-ui/core/colors/orange";

import Bar from "./components/Bar";
import User from "./views/User";
import DetailIndex from "./views/Detail";
import ListIndex from "./views/List";
import { store } from "./data";

import "./App.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue["A200"],
    },
    secondary: {
      main: orange["A200"],
    },
  },
});

const App = () => {
  return (
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Bar />
          <div className="main-container">
            <Switch>
              <Route exact path="/">
                <Redirect push to="/list/problem/1" />
              </Route>
              <Route path="/user" component={User} />
              <Route path="/detail" component={DetailIndex} />
              <Route path="/list" component={ListIndex} />
            </Switch>
          </div>
        </ThemeProvider>
      </Provider>
    </Router>
  );
};

export default App;

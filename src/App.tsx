import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import Bar from "./components/Bar";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import blue from "@material-ui/core/colors/blue";
import orange from "@material-ui/core/colors/orange";
import "./App.css";
import User from "./views/User";
import DetailIndex from "./views/Detail";
import ListIndex from "./views/List";

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
      <ThemeProvider theme={theme}>
        <Bar />
        <div className="main-container">
          <Switch>
            <Route path="/user" component={User} />
            <Route path="/detail" component={DetailIndex} />
            <Route path="/list" component={ListIndex} />
          </Switch>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;

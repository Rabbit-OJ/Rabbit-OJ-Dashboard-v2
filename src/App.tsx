import React from "react";
import {
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";

import Bar from "./components/Bar";

import { blue, orange } from "@material-ui/core/colors";
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
    <ThemeProvider theme={theme}>
      <Bar />
    </ThemeProvider>
  );
};

export default App;

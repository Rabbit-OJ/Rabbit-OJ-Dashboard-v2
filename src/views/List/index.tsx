import React from "react";
import { Route, Switch } from "react-router-dom";

import ProblemView from "./Problem";

const ListIndex = () => {
  return (
    <Switch>
      <Route path="/list/problem/:page" component={ProblemView} />
    </Switch>
  );
};

export default ListIndex;

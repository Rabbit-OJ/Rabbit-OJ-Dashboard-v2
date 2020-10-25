import React from "react";
import { Route, Switch } from "react-router-dom";

import ProblemView from "./Problem";
import SubmissionListView from "./Submission";

const ListIndex = () => {
  return (
    <Switch>
      <Route path="/list/problem/:page" component={ProblemView} />
      <Route path="/list/submission/:sid" component={SubmissionListView} />
    </Switch>
  );
};

export default ListIndex;

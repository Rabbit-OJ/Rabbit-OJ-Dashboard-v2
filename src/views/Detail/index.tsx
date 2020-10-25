import React from "react";
import { Route, Switch } from "react-router-dom";

import DetailProblem from "./Problem";
import DetailSubmission from "./Submission";


const DetailIndex = () => {
  return (
    <Switch>
      <Route path="/detail/problem/:tid" component={DetailProblem} />
      <Route path="/detail/submission/:sid" component={DetailSubmission} />
    </Switch>
  );
};

export default DetailIndex;

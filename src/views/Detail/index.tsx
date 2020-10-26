import React from "react";
import { Route, Switch } from "react-router-dom";
import DetailContest from "./Contest";

import DetailProblem from "./Problem";
import DetailSubmission from "./Submission";


const DetailIndex = () => {
  return (
    <Switch>
      <Route path="/detail/problem/:tid" component={DetailProblem} />
      <Route path="/detail/submission/:sid" component={DetailSubmission} />
      <Route path="/detail/contest/:cid" component={DetailContest} />
    </Switch>
  );
};

export default DetailIndex;

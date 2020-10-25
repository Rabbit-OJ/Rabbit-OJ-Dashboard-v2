import React from "react";
import { Route, Switch } from "react-router-dom";

import DetailInfo from "./Info";


const DetailIndex = () => {
  return (
    <Switch>
      <Route path="/detail/problem/:tid" component={DetailInfo} />
    </Switch>
  );
};

export default DetailIndex;
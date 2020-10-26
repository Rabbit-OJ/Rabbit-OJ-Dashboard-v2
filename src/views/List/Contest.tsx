import React from "react";

import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import ContestListComponent from "../../components/List/Contest";
import { Contest } from "../../model/contest";

const LIST_DEMO_DATA: Contest[] = [
  {
    cid: 1,
    name: "Contest 1",
    uid: 1,
    start_time: new Date(),
    block_time: new Date(),
    end_time: new Date(),
    status: 0,
    participants: 0,
    penalty: 300,
    count: 1,
  },
];

const useStyles = makeStyles(() =>
  createStyles({
    main: {
      margin: "24px 0",
      padding: "24px 12px 12px 12px",
    },
  })
);

const ContestListView = () => {
  const classes = useStyles();

  return (
    <>
      <h1>Contest</h1>
      <Paper className={classes.main}>
        <ContestListComponent list={LIST_DEMO_DATA} page={1} pageCount={10} />
      </Paper>
    </>
  );
};

export default ContestListView;

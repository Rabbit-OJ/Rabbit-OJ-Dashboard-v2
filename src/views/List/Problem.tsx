import React from "react";

import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import ProblemListComponent from "../../components/List/Problem";
import { QuestionItem } from "../../model/question-list";

const LIST_DEMO_DATA: QuestionItem[] = [
  {
    tid: 1,
    uid: 1,
    subject: "A + B Problem",
    attempt: 0,
    accept: 0,
    difficulty: 1,
    time_limit: 1000,
    space_limit: 128,
    created_at: new Date(),
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

const ProblemListView = () => {
  const classes = useStyles();

  return (
    <>
      <h1>Problems</h1>
      <Paper className={classes.main}>
        <ProblemListComponent list={LIST_DEMO_DATA} page={1} pageCount={10} />
      </Paper>
    </>
  );
};

export default ProblemListView;

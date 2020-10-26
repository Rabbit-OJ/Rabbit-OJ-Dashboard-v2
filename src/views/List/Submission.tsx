import React from "react";

import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import SubmissionListComponent from "../../components/List/Submission";
import { SubmissionLite } from "../../model/submission";

const LIST_DEMO_DATA: SubmissionLite[] = [
  {
    sid: 1,
    uid: 1,
    tid: 1,
    question_title: "A + B Problem",
    status: "AC",
    language: "C++ 17",
    time_used: 1,
    space_used: 1,
    created_at: new Date(),
  },
];

const useStyles = makeStyles(() =>
  createStyles({
    main: {
      margin: "24px 0",
      padding: "24px 12px 12px 12px"
    },
  })
);

const SubmissionListView = () => {
  const classes = useStyles();

  return (
    <>
      <h1>My Submissions</h1>
      <Paper className={classes.main}>
        <SubmissionListComponent
          list={LIST_DEMO_DATA}
          page={1}
          pageCount={10}
        />
      </Paper>
    </>
  );
};

export default SubmissionListView;

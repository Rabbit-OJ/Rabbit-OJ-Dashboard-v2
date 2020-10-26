import React, { useState } from "react";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import DescriptionComponent from "../../components/Description";
import { QuestionDetail } from "../../model/question-detail";
import SubmitComponent from "../../components/Submit";
import { SubmissionLite } from "../../model/submission";
import SubmissionListComponent from "../../components/List/Submission";

const DEFAULT_QUESTION: QuestionDetail = {
  tid: 1,
  hide: false,
  subject: "A + B Problem",
  content: "Output A + B value.",
  sample: [{ in: "1 2", out: "3" }],
  attempt: 0,
  accept: 0,
  time_limit: 1000,
  space_limit: 128,
  created_at: "2020/01/01",
  difficulty: 1,
};

const SUBMISSION_DEMO_DATA: SubmissionLite[] = [
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
    bodyContainer: {
      padding: "24px",
    },
    main: {
      margin: "24px 0",
    },
  })
);

const DetailProblem = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const classes = useStyles();

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <h1>
        {question.hide && (
          <span role="img" aria-label="Locked">
            🔒
          </span>
        )}
        {question.subject}
      </h1>
      <Paper className={classes.main}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Detail" />
          <Tab label="Submit" />
          <Tab label="Submission" />
          <Tab label="Admin" />
        </Tabs>
        <div className={classes.bodyContainer}>
          {tabIndex === 0 && <DescriptionComponent question={question} />}
          {tabIndex === 1 && <SubmitComponent question={question} />}
          {tabIndex === 2 && (
            <SubmissionListComponent
              list={SUBMISSION_DEMO_DATA}
              page={1}
              pageCount={10}
            />
          )}
        </div>
      </Paper>
    </>
  );
};

export default DetailProblem;

import React, { useState } from "react";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import DescriptionComponent from "../../components/Description";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import { QuestionDetail } from "../../model/question-detail";
import SubmitComponent from "../../components/Submit";

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

const useStyles = makeStyles(() =>
  createStyles({
    bodyContainer: {
      padding: "24px",
    },
    main: {
      margin: "24px 0"
    }
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
        {question.hide && <span role="img" aria-label="Locked">🔒</span>}
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
        </div>
      </Paper>
    </>
  );
};

export default DetailProblem;

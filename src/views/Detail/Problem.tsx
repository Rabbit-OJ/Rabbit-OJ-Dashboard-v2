import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import DescriptionComponent from "../../components/Description";
import { QuestionDetail } from "../../model/question-detail";
import SubmitComponent from "../../components/Submit";
import { SubmissionLite } from "../../model/submission";
import SubmissionListComponent from "../../components/List/Submission";
import RabbitFetch from "../../utils/fetch";
import API_URL from "../../utils/url";
import { GeneralResponse } from "../../model/general-response";
import { SubmissionResponse } from "../../model/submission-response";
import { calculatePageCount } from "../../utils/page";
import { emitSnackbar } from "../../data/emitter";

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
  const { tid } = useParams<{ tid: string }>();
  const [tabIndex, setTabIndex] = useState(0);
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [submissionData, setSubmissionData] = useState(SUBMISSION_DEMO_DATA);
  const [submissionListPage, setSubmissionListPage] = useState(1);
  const [submissionListPageCount, setSubmissionListPageCount] = useState(10);
  const history = useHistory();

  const fetchProblemInfo = useCallback(async () => {
    const res = await RabbitFetch<GeneralResponse<QuestionDetail>>(
      API_URL.QUESTION.OPTIONS_ITEM(tid),
      {
        method: "GET",
      }
    );

    const { message } = res;
    setQuestion(message);
  }, [tid]);
  const fetchSubmissionRecord = useCallback(async () => {
    const res = await RabbitFetch<GeneralResponse<SubmissionResponse>>(
      API_URL.QUESTION.GET_RECORD(tid, submissionListPage.toString()),
      {
        method: "GET",
      }
    );

    const { list, count } = res.message;
    setSubmissionData(list);
    setSubmissionListPageCount(calculatePageCount(count));
  }, [submissionListPage]);
  const handleSubmit = useCallback(
    async ({ code, language }: { code: string; language: string }) => {
      if (language === "") {
        emitSnackbar("Select a language first!", { variant: "warning" });
        return;
      }

      const { code: stautsCode, message } = await RabbitFetch<
        GeneralResponse<string>
      >(API_URL.QUESTION.POST_SUBMIT(tid), {
        method: "POST",
        body: { language, code },
      });

      if (stautsCode === 200) {
        history.push(`/detail/submission/${message}`);
      } else {
        emitSnackbar(message, { variant: "error" });
      }
    },
    [tid]
  );

  useEffect(() => {
    fetchProblemInfo();
  }, [tid]);
  useEffect(() => {
    fetchSubmissionRecord();
  }, [submissionListPage]);

  const classes = useStyles();
  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };
  const handleSubmissionOnPageChange = (newPage: number) => {
    setSubmissionListPage(newPage);
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
          {/* <Tab label="Admin" /> */}
        </Tabs>
        <div className={classes.bodyContainer}>
          {tabIndex === 0 && <DescriptionComponent question={question} />}
          {tabIndex === 1 && (
            <SubmitComponent
              tid={question.tid.toString()}
              onSubmit={handleSubmit}
            />
          )}
          {tabIndex === 2 && (
            <SubmissionListComponent
              list={submissionData}
              page={submissionListPage}
              pageCount={submissionListPageCount}
              onPageChange={handleSubmissionOnPageChange}
            />
          )}
        </div>
      </Paper>
    </>
  );
};

export default DetailProblem;

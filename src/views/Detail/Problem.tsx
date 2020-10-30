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
import { useTypedSelector } from "../../data";

const DEFAULT_QUESTION: QuestionDetail = {
  tid: 1,
  hide: false,
  subject: "Loading ...",
  content: "",
  sample: [],
  attempt: 0,
  accept: 0,
  time_limit: 0,
  space_limit: 0,
  created_at: "",
  difficulty: 1,
};

const SUBMISSION_DEMO_DATA: SubmissionLite[] = [];

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
  const [submissionListPageCount, setSubmissionListPageCount] = useState(1);
  const history = useHistory();

  const { isLogin } = useTypedSelector((state) => ({
    isLogin: state.user.isLogin,
  }));

  const fetchProblemInfo = useCallback(async () => {
    const { code, message } = await RabbitFetch<
      GeneralResponse<QuestionDetail>
    >(API_URL.QUESTION.OPTIONS_ITEM(tid), {
      method: "GET",
    });

    if (code === 200) {
      setQuestion(message);
    } else {
      emitSnackbar(message, { variant: "error" });
    }
  }, [tid]);

  const fetchSubmissionRecord = useCallback(async () => {
    if (!isLogin) return;

    const { code, message } = await RabbitFetch<
      GeneralResponse<SubmissionResponse>
    >(API_URL.QUESTION.GET_RECORD(tid, submissionListPage.toString()), {
      method: "GET",
    });

    if (code === 200) {
      const { list, count } = message;
      setSubmissionData(list);
      setSubmissionListPageCount(calculatePageCount(count));
    } else {
      emitSnackbar(message, { variant: "error" });
    }
  }, [tid, submissionListPage, isLogin]);
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
    [tid, history]
  );

  useEffect(() => {
    fetchProblemInfo();
  }, [fetchProblemInfo]);
  useEffect(() => {
    fetchSubmissionRecord();
  }, [fetchSubmissionRecord]);

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
          {isLogin && <Tab label="Submit" />}
          {isLogin && <Tab label="Submission" />}
          {/* <Tab label="Admin" /> */}
        </Tabs>
        <div className={classes.bodyContainer}>
          {tabIndex === 0 && (
            <DescriptionComponent question={question} isContest={false} />
          )}
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

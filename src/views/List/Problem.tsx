import React, { useCallback, useEffect, useState } from "react";

import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import ProblemListComponent from "../../components/List/Problem";
import { GeneralListResponse, QuestionItem } from "../../model/question-list";
import { useParams } from "react-router";
import { GeneralResponse } from "../../model/general-response";
import RabbitFetch from "../../utils/fetch";
import API_URL from "../../utils/url";

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
  const { page } = useParams<{ page: string }>();
  const [pageCount, setPageCount] = useState(1);
  const [list, setList] = useState(LIST_DEMO_DATA);

  const fetchList = useCallback(async () => {
    const { message } = await RabbitFetch<
      GeneralResponse<GeneralListResponse<QuestionItem>>
    >(API_URL.QUESTION.GET_LIST(page));

    setList(message.list);
    setPageCount(message.count);
  }, [page]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const classes = useStyles();
  return (
    <>
      <h1>Problems</h1>
      <Paper className={classes.main}>
        <ProblemListComponent list={list} page={+page} pageCount={pageCount} />
      </Paper>
    </>
  );
};

export default ProblemListView;

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import ProblemListComponent from "../../components/List/Problem";
import { GeneralListResponse, QuestionItem } from "../../model/question-list";
import { GeneralResponse } from "../../model/general-response";
import RabbitFetch from "../../utils/fetch";
import API_URL from "../../utils/url";
import { calculatePageCount } from "../../utils/page";
import { emitSnackbar } from "../../data/emitter";

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
  const [list, setList] = useState<QuestionItem[]>([]);

  const fetchList = useCallback(async () => {
    const { code, message } = await RabbitFetch<
      GeneralResponse<GeneralListResponse<QuestionItem>>
    >(API_URL.QUESTION.GET_LIST(page));

    if (code === 200) {
      setList(message.list);
      setPageCount(calculatePageCount(message.count));
    } else {
      emitSnackbar(message, { variant: "error" });
    }
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

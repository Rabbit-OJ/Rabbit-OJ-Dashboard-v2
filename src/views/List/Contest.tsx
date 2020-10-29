import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import ContestListComponent from "../../components/List/Contest";
import { Contest } from "../../model/contest";
import RabbitFetch from "../../utils/fetch";
import { GeneralResponse } from "../../model/general-response";
import { GeneralListResponse } from "../../model/question-list";
import API_URL from "../../utils/url";
import { calculatePageCount } from "../../utils/page";
import { emitSnackbar } from "../../data/emitter";

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
  const { page } = useParams<{ page: string }>();
  const [pageCount, setPageCount] = useState(1);
  const [list, setList] = useState(LIST_DEMO_DATA);

  const fetchList = useCallback(async () => {
    const { code, message } = await RabbitFetch<
      GeneralResponse<GeneralListResponse<Contest>>
    >(API_URL.CONTEST.GET_LIST(page));

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
      <h1>Contest</h1>
      <Paper className={classes.main}>
        <ContestListComponent list={list} page={+page} pageCount={pageCount} />
      </Paper>
    </>
  );
};

export default ContestListView;

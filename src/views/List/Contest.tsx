import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

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

const useStyles = makeStyles(() =>
  createStyles({
    main: {
      margin: "24px 0",
      padding: "24px 12px",
    },
  })
);

const ContestListView = () => {
  const { page } = useParams<{ page: string }>();
  const [pageCount, setPageCount] = useState(1);
  const [list, setList] = useState<Contest[]>([]);
  const history = useHistory();

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

  const handleOnPageChange = useCallback(
    (newPage: number) => {
      history.push(`/list/contest/${newPage}`);
    },
    [history]
  );

  const classes = useStyles();
  return (
    <>
      <h1>Contest</h1>
      <Paper className={classes.main}>
        <ContestListComponent
          list={list}
          page={+page}
          pageCount={pageCount}
          onPageChange={handleOnPageChange}
        />
      </Paper>
    </>
  );
};

export default ContestListView;

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import SubmissionListComponent from "../../components/List/Submission";
import { SubmissionLite } from "../../model/submission";
import { GeneralResponse } from "../../model/general-response";
import RabbitFetch from "../../utils/fetch";
import API_URL from "../../utils/url";
import { SubmissionResponse } from "../../model/submission-response";
import { useTypedSelector } from "../../data";
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

const SubmissionListView = () => {
  const { page } = useParams<{ page: string }>();
  const [pageCount, setPageCount] = useState(1);
  const [list, setList] = useState<SubmissionLite[]>([]);

  const { isLogin, uid } = useTypedSelector((state) => ({
    isLogin: state.user.isLogin,
    uid: state.user.uid,
  }));

  const fetchList = useCallback(async () => {
    if (!isLogin) {
      return;
    }

    const { code, message } = await RabbitFetch<
      GeneralResponse<SubmissionResponse>
    >(API_URL.SUBMISSION.GET_USER_LIST(uid.toString(), page));

    if (code === 200) {
      setList(message.list);
      setPageCount(calculatePageCount(message.count));
    } else {
      emitSnackbar(message, { variant: "error" });
    }
  }, [page, isLogin, uid]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const classes = useStyles();
  return (
    <>
      <h1>My Submissions</h1>
      <Paper className={classes.main}>
        <SubmissionListComponent
          list={list}
          page={+page}
          pageCount={pageCount}
        />
      </Paper>
    </>
  );
};

export default SubmissionListView;

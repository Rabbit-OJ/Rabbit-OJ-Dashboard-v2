import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles } from "@material-ui/core/styles";

import SubmissionListComponent from "../../components/List/Submission";
import { SubmissionLite } from "../../model/submission";
import { GeneralResponse } from "../../model/general-response";
import RabbitFetch from "../../utils/fetch";
import API_URL from "../../utils/url";
import { SubmissionResponse } from "../../model/submission-response";
import { IStoreType } from "../../data";
import { UserStore } from "../../data/user";
import { calculatePageCount } from "../../utils/page";

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
      padding: "24px 12px 12px 12px",
    },
  })
);

const SubmissionListView = () => {
  const { page } = useParams<{ page: string }>();
  const [pageCount, setPageCount] = useState(1);
  const [list, setList] = useState(LIST_DEMO_DATA);

  const { isLogin, uid } = useSelector<
    IStoreType,
    Pick<UserStore, "isLogin" | "uid">
  >((state) => ({
    isLogin: state.user.isLogin,
    uid: state.user.uid,
  }));

  const fetchList = useCallback(async () => {
    const { message } = await RabbitFetch<GeneralResponse<SubmissionResponse>>(
      API_URL.SUBMISSION.GET_USER_LIST(uid.toString(), page)
    );

    setList(message.list);
    setPageCount(calculatePageCount(message.count));
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

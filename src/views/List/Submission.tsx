import React from "react";
import SubmissionListComponent from "../../components/SubmissionList";
import { SubmissionLite } from "../../model/submission";

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

const SubmissionListView = () => {
  return (
    <>
      <SubmissionListComponent list={LIST_DEMO_DATA} />
    </>
  );
};

export default SubmissionListView;

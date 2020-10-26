import React from "react";
import ProblemListComponent from "../../components/List/Problem";
import { QuestionItem } from "../../model/question-list";

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

const ProblemListView = () => {
  return (
    <>
      <ProblemListComponent list={LIST_DEMO_DATA} page={1} pageCount={10} />
    </>
  );
};

export default ProblemListView;

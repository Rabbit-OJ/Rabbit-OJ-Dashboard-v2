import React from "react";
import ContestListComponent from "../../components/List/Contest";
import { Contest } from "../../model/contest";

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

const ContestListView = () => {
  return (
    <>
      <ContestListComponent list={LIST_DEMO_DATA} />
    </>
  );
};

export default ContestListView;

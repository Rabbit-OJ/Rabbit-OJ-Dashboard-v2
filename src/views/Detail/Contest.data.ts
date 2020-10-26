import { Contest } from "../../model/contest";
import { ContestClarify } from "../../model/contest-clarify";
import { ContestMyInfo } from "../../model/contest-my-info";
import { ContestQuestion } from "../../model/contest-question";
import { ScoreBoard } from "../../model/score-board";
import { ContestSubmission } from "../../model/submission";

export const DEFAULT_CONTEST: Contest<string> = {
  name: "Loading...",
  start_time: new Date().toLocaleString(),
  block_time: new Date().toLocaleString(),
  end_time: new Date().toLocaleString(),
  status: 1,
  participants: 0,
  penalty: 300,
  count: 1,
  cid: 0,
  uid: 0,
};

export const DEFAULT_MY_INFO: ContestMyInfo = {
  score: 0,
  rank: 0,
  total_time: 0,
  progress: [],
  registered: false,
};

export const DEFAULT_CLARIFY_LIST: Array<ContestClarify<string>> = [
  {
    cid: 1,
    created_at: new Date().toString(),
    message: "233",
  },
  {
    cid: 2,
    created_at: new Date().toString(),
    message: "455",
  },
];

export const DEFAULT_SUBMISSION_LIST: Array<ContestSubmission<string>> = [
  {
    sid: 1,
    cid: 1,
    uid: 1,
    tid: 1,
    status: 1,
    total_time: 12,
    created_at: new Date().toString(),
  },
  {
    sid: 2,
    cid: 1,
    uid: 1,
    tid: 1,
    status: 1,
    total_time: 12,
    created_at: new Date().toString(),
  },
];

export const DEFAULT_PROBLEM: Array<ContestQuestion> = [
  {
    cid: 1,
    tid: 1,
    id: 1,
    score: 3,
    uid: 1,
    subject: "A + B Problem",
    difficulty: 0,
    time_limit: 1000,
    space_limit: 128,
    created_at: new Date().toString(),
    content: "A + B Problem",
    sample: [
      {
        in: "1 2",
        out: "3",
      },
    ],
    attempt: 1,
    accept: 1,
  },
];

export const DEFAULT_SCOREBOARD_LIST: Array<ScoreBoard> = [
  {
    uid: 1,
    username: "aaa",
    score: 1,
    total_time: 26,
    rank: 1,
    progress: [
      {
        status: 1,
        bug: 2,
        total_time: 0,
      },
      {
        status: 1,
        bug: 2,
        total_time: 15,
      },
    ],
  },
  {
    uid: 2,
    username: "bbb",
    score: 1,
    total_time: 55,
    rank: 2,
    progress: [
      {
        status: -1,
        bug: 2,
        total_time: 12,
      },
      {
        status: 1,
        bug: 2,
        total_time: 15,
      },
    ],
  },
];
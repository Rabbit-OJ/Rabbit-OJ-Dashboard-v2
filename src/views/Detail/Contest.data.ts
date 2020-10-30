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

export const DEFAULT_CLARIFY_LIST: Array<ContestClarify<string>> = [];
export const DEFAULT_SUBMISSION_LIST: Array<ContestSubmission<string>> = [];
export const DEFAULT_PROBLEM: Array<ContestQuestion> = [];
export const DEFAULT_SCOREBOARD_LIST: Array<ScoreBoard> = [];

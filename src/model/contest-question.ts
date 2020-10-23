import { Sample } from "./sample";

export interface ContestQuestion {
  cid: number;
  tid: number;
  id: number;
  score: number;
  uid: number;
  subject: string;
  difficulty: 0 | 1 | 2;
  time_limit: number;
  space_limit: number;
  created_at: string;
  content: string;
  sample: Array<Sample>;
  attempt: number;
  accept: number;
}

export interface ContestQuestionLite {
  tid: number;
  id: number;
  score: number;
}

export interface ContestQuestionItem {
  subject: string;
  id: number;
}
export type JudgeStatus = "ING" | "AC" | "WA" | "CE" | "RE" | "TLE" | "MLE" | "NO";
export type ResponseDate = string | Date;

export interface SubmissionLite {
  sid: number;
  uid: number;
  tid: number;
  question_title: string;
  status: JudgeStatus;
  language: string;
  time_used: number;
  space_used: number | string;
  created_at: Date;
}

export interface ContestSubmission<T = string> {
  sid: number;
  uid: number;
  tid: number;
  status: number;
  created_at: T;
  total_time: number;
}

export interface Submission extends SubmissionLite {
  sid: number;
  uid: number;
  tid: number;
  question_title: string;
  status: JudgeStatus;
  language: string;
  time_used: number;
  space_used: number | string;
  created_at: Date;
  judge: Array<JudgeResult>;
}

export interface JudgeResult {
  status: JudgeStatus;
  time_used: number;
  space_used: number;
}

export interface ContestSubmission<T = string> {
  sid: number;
  cid: number;
  uid: number;
  tid: number;
  status: number;
  total_time: number;
  created_at: T;
}
import { Sample } from "./sample";

export interface QuestionDetail {
  tid: number;
  content: string;
  subject: string;
  attempt: number;
  accept: number;
  difficulty: number;
  time_limit: number;
  space_limit: number;
  created_at: string;
  hide: boolean;
  sample: Array<Sample>;
}

export interface QuestionItem {
  tid: number;
  uid: number;
  subject: string;
  attempt: number;
  accept: number;
  difficulty: number;
  time_limit: number;
  space_limit: number;
  created_at: Date;
}

export type GeneralListResponse<T> = {
  list: Array<T>;
  count: number;
};

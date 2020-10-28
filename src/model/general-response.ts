export interface GeneralResponse<T = undefined> {
  code: number;
  message: T;
}

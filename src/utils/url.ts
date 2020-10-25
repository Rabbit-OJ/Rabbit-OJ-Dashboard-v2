const ENV = process.env.NODE_ENV === 'production';
const BACKEND_URL = ENV ? `https://oj.6rabbit.com/api` : `http://localhost:8888`;
const BACKEND_SOCKET_URL = BACKEND_URL.replace(/^http/, "ws");

const QUESTION = {
  GET_LIST: (page: string) => `${BACKEND_URL}/question/list/${page}`,
  OPTIONS_ITEM: (tid: string) => `${BACKEND_URL}/question/item/${tid}`,
  POST_CREATE: `${BACKEND_URL}/question/item`,
  PUT_EDIT: (tid: string)=>`${BACKEND_URL}/question/item/${tid}`,
  POST_SUBMIT: (tid: string) => `${BACKEND_URL}/question/submit/${tid}`,
  GET_RECORD: (tid: string, page: string) => `${BACKEND_URL}/question/record/${tid}/${page}`,
  OPTIONS_JUDGE: (tid: string) => `${BACKEND_URL}/question/judge/${tid}`
};

const USER = {
  GET_INFO: (username: string) => `${BACKEND_URL}/user/info/${username}`,
  AVATAR: (uid: string) => `${BACKEND_URL}/user/avatar/${uid}`,
  GET_MY: `${BACKEND_URL}/user/my`,
  GET_TOKEN: `${BACKEND_URL}/user/token`,
  POST_CHANGE_AVATAR: `${BACKEND_URL}/user/my/avatar`,
  POST_LOGIN: `${BACKEND_URL}/user/login`,
  POST_REGISTER: `${BACKEND_URL}/user/register`
};

const SUBMISSION = {
  GET_USER_LIST: (uid: string, page: string) => `${BACKEND_URL}/submission/list/${uid}/${page}`,
  GET_DETAIL: (sid: string) => `${BACKEND_URL}/submission/detail/${sid}`,
  POST_CODE: (sid: string) => `${BACKEND_URL}/submission/code/${sid}`,
  GET_LANGUAGE: `${BACKEND_URL}/submission/language`,
  SOCKET: (sid: string) => `${BACKEND_SOCKET_URL}/ws/${sid}`
};

const CONTEST = {
  PUT_EDIT: (cid: string) => `${BACKEND_URL}/contest/info/${cid}`,
  PUT_QUESTION: (cid: string) => `${BACKEND_URL}/contest/question/${cid}`,
  GET_LIST: (page: string) => `${BACKEND_URL}/contest/list/${page}`,
  GET_MY_INFO: (cid: string) => `${BACKEND_URL}/contest/my/info/${cid}`,
  POST_SUBMIT: (cid: string, id: string) => `${BACKEND_URL}/contest/submit/${cid}/${id}`,
  GET_CLARIFY: (cid: string) => `${BACKEND_URL}/contest/clarify/${cid}`,
  POST_CLARIFY_ADD: `${BACKEND_URL}/contest/clarify/add`,
  GET_SUBMISSION_LIST: (cid: string) => `${BACKEND_URL}/contest/submission/list/${cid}`,
  GET_SUBMISSION_ONE: (cid: string, sid: string) => `${BACKEND_URL}/contest/submission/one/${cid}/${sid}`,
  GET_SCORE_BOARD: (cid: string, page: string) => `${BACKEND_URL}/contest/scoreboard/${cid}/${page}`,
  GET_INFO: (cid: string) => `${BACKEND_URL}/contest/info/${cid}`,
  GET_QUESTIONS: (cid: string) => `${BACKEND_URL}/contest/question/${cid}`,
  POST_REGISTER: (cid: string, operation: "cancel" | "reg") => `${BACKEND_URL}/contest/register/${cid}/${operation}`,
  SOCKET: (cid: string, uid: string) => `${BACKEND_SOCKET_URL}/contest/ws/${cid}/${uid}`
};

const API_URL = {
  QUESTION, USER, SUBMISSION, CONTEST
};

export default API_URL;
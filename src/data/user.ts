import * as actions from "./actions";
import { MiniUser } from "../model/mini-user";

export type UserStore = MiniUser;

type Action = actions.Login | actions.Logout;

const initState: UserStore = {
  uid: 0,
  username: "",
  isAdmin: false,
  isLogin: false,
};

export const userReducer = (state = initState, action: Action): UserStore => {
  switch (action.type) {
    case actions.LOGIN:
      const { uid, username, isAdmin } = action;
      return { ...state, uid, username, isAdmin, isLogin: true };
    case actions.LOGOUT:
      return {
        ...state,
        uid: 0,
        username: "",
        isAdmin: false,
        isLogin: false,
      };
  }
  return state;
};


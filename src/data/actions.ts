export const LOGIN = "LOGIN";
export type LOGIN = typeof LOGIN;
export interface Login {
  type: LOGIN;
  isAdmin: boolean;
  username: string;
  uid: number;
}
export const login = (
  uid: number,
  username: string,
  isAdmin: boolean
): Login => {
  return {
    type: LOGIN,
    uid,
    username,
    isAdmin,
  };
};

export const LOGOUT = "LOGOUT";
export type LOGOUT = typeof LOGOUT;
export interface Logout {
  type: LOGOUT;
}
export const logout = (): Logout => {
  return {
    type: LOGOUT,
  };
};

export const LOADING_INC = "LOADING_INC";
export type LOADING_INC = typeof LOADING_INC;
export interface LoadingIncrement {
  type: LOADING_INC;
}
export const loadingInc = (): LoadingIncrement => {
  return {
    type: LOADING_INC,
  };
};

export const LOADING_DEC = "LOADING_DEC";
export type LOADING_DEC = typeof LOADING_DEC;
export interface LoadingDecrement {
  type: LOADING_DEC;
}
export const loadingDec = (): LoadingDecrement => {
  return {
    type: LOADING_DEC,
  };
};

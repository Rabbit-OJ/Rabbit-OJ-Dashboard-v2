export const LOGIN = "LOGIN";
export type LOGIN = typeof LOGIN;
export interface Login {
  type: LOGIN;
  isAdmin: boolean;
  username: string;
  uid: number;
}
export const login = function (
  uid: number,
  username: string,
  isAdmin: boolean
): Login {
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
export const logout = function (): Logout {
  return {
    type: LOGOUT,
  };
};

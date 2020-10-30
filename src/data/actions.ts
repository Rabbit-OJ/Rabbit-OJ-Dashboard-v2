import { Language } from "../model/language";

export const LOGIN = "LOGIN";
export type ILOGIN = typeof LOGIN;
export interface Login {
  type: ILOGIN;
  isAdmin: boolean;
  username: string;
  uid: number;
}
export const login = (args: {
  uid: number;
  username: string;
  isAdmin: boolean;
}): Login => {
  const { uid, username, isAdmin } = args;
  return {
    type: LOGIN,
    uid,
    username,
    isAdmin,
  };
};

export const LOGOUT = "LOGOUT";
export type ILOGOUT = typeof LOGOUT;
export interface Logout {
  type: ILOGOUT;
}
export const logout = (): Logout => {
  return {
    type: LOGOUT,
  };
};

export const LOADING_INC = "LOADING_INC";
export type ILOADING_INC = typeof LOADING_INC;
export interface LoadingIncrement {
  type: ILOADING_INC;
}
export const loadingInc = (): LoadingIncrement => {
  return {
    type: LOADING_INC,
  };
};

export const LOADING_DEC = "LOADING_DEC";
export type ILOADING_DEC = typeof LOADING_DEC;
export interface LoadingDecrement {
  type: ILOADING_DEC;
}
export const loadingDec = (): LoadingDecrement => {
  return {
    type: LOADING_DEC,
  };
};

export const LANGUAGE_SET = "LANGUAGE_SET";
export type ILANGUAGE_SET = typeof LANGUAGE_SET;
export interface LanguageSet {
  type: ILANGUAGE_SET;
  data: Language[];
}
export const languageSet = (data: Language[]): LanguageSet => {
  return {
    type: LANGUAGE_SET,
    data,
  };
};

export const LANGUAGE_CLEAR = "LANGUAGE_CLEAR";
export type ILANGUAGE_CLEAR = typeof LANGUAGE_CLEAR;
export interface LanguageClear {
  type: ILANGUAGE_CLEAR;
}
export const languageClear = (): LanguageClear => {
  return {
    type: LANGUAGE_CLEAR,
  };
};

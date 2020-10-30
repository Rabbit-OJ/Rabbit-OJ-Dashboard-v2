import * as actions from "./actions";
import { Language, LanguageResponse } from "../model/language";
import RabbitFetch from "../utils/fetch";
import API_URL from "../utils/url";
import { GeneralResponse } from "../model/general-response";
import { emitSnackbar } from "./emitter";

export type LanguageStore = Language[];

type Action = actions.LanguageSet | actions.LanguageClear;

const initState: LanguageStore = [];

export const languageReducer = (
  state = initState,
  action: Action
): LanguageStore => {
  switch (action.type) {
    case actions.LANGUAGE_SET:
      return [...action.data];
    case actions.LANGUAGE_CLEAR:
      return [];
  }
  return state;
};

export const fetchLanguageList = async () => {
  const { code, message } = await RabbitFetch<
    GeneralResponse<LanguageResponse>
  >(API_URL.SUBMISSION.GET_LANGUAGE, {
    method: "GET",
  });

  if (code === 200) {
    return message;
  } else {
    emitSnackbar(message, { variant: "error" });
    return [];
  }
};

import { combineReducers, createStore } from "redux";
import { TypedUseSelectorHook, useSelector } from "react-redux";

import { userReducer, UserStore } from "./user";
import { loadingReducer, LoadingStore } from "./loading";
import { languageReducer, LanguageStore } from "./language";

const reducer = combineReducers({
  user: userReducer,
  loading: loadingReducer,
  language: languageReducer
});

export interface IStoreType {
  user: UserStore;
  loading: LoadingStore;
  language: LanguageStore;
}

export const useTypedSelector: TypedUseSelectorHook<IStoreType> = useSelector;
export const store = createStore(reducer);

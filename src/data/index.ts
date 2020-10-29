import { combineReducers, createStore } from "redux";
import { TypedUseSelectorHook, useSelector } from "react-redux";

import { userReducer, UserStore } from "./user";
import { loadingReducer, LoadingStore } from "./loading";

const reducer = combineReducers({
  user: userReducer,
  loading: loadingReducer,
});

export interface IStoreType {
  user: UserStore;
  loading: LoadingStore;
}

export const useTypedSelector: TypedUseSelectorHook<IStoreType> = useSelector;
export const store = createStore(reducer);

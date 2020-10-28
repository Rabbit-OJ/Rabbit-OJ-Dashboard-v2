import { userReducer, UserStore } from "./user";
import { loadingReducer, LoadingStore } from "./loading";
import { combineReducers, createStore } from "redux";

const reducer = combineReducers({
  user: userReducer,
  loading: loadingReducer,
});

export interface IStoreType {
  user: UserStore;
  loading: LoadingStore;
}

export const store = createStore(reducer);

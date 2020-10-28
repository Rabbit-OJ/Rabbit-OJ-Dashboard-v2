import * as actions from "./actions";
import { ILoading } from "../model/loading";

export type LoadingStore = ILoading;

type Action = actions.LoadingIncrement | actions.LoadingDecrement;

const initState: LoadingStore = {
  loadingCount: 0,
};

export const loadingReducer = (
  state = initState,
  action: Action
): LoadingStore => {
  switch (action.type) {
    case actions.LOADING_INC:
      return { loadingCount: state.loadingCount + 1 };
    case actions.LOADING_DEC:
      return { loadingCount: state.loadingCount - 1 };
  }
  return state;
};

// export const loadingStore = createStore(loadingReducer);

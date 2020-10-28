import { loadingDec, loadingInc } from "../data/actions";
import { emitSnackbar } from "../data/emitter";

export interface RabbitFetchParams {
  dispatcher?: (action: any) => void;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: Object | string;
}

const RabbitFetch = async <T>(
  input: RequestInfo,
  init?: RabbitFetchParams
): Promise<T> => {
  const dispatcher = init?.dispatcher;

  try {
    dispatcher && dispatcher(loadingInc());
    const requestInit: RequestInit = {
      method: init?.method ?? "GET",
      headers: {},
    };

    if (init?.body) {
      const body = init?.body;
      if (typeof body === "string") {
        requestInit.body = body;
      } else {
        requestInit.body = JSON.stringify(body);
      }
    }

    const token = localStorage.getItem("token");
    if (token) {
      requestInit.headers = {
        token,
      };
    }

    const res = await fetch(input, requestInit);
    return (await res.json()) as T;
  } catch (err) {
    emitSnackbar(err.toString(), { variant: "error" });
    throw err;
  } finally {
    dispatcher && dispatcher(loadingDec());
  }
};

export default RabbitFetch;

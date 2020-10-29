import { loadingDec, loadingInc } from "../data/actions";
import { emitSnackbar } from "../data/emitter";

export interface RabbitFetchParams {
  dispatcher?: (action: any) => void;
  method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS";
  body?: Object | string;
  headers?: { [key: string]: string };
  responseType?: "string" | "json" | "buffer" | "blob";
}

const RabbitFetch = async <T>(
  input: RequestInfo,
  init?: RabbitFetchParams
): Promise<T> => {
  const dispatcher = init?.dispatcher;
  const responseType: "string" | "json" | "buffer" | "blob" =
    init?.responseType ?? "json";

  try {
    dispatcher && dispatcher(loadingInc());

    const requestInit: RequestInit = {
      method: init?.method ?? "GET",
      headers: init?.headers ?? {},
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
        ...requestInit.headers,
        token,
      };
    }

    const res = await fetch(input, requestInit);

    if (responseType === "json") {
      return (await res.json()) as T;
    } else if (responseType === "string") {
      return ((await res.text()) as any) as T;
    } else if (responseType === "buffer") {
      return ((await res.arrayBuffer()) as any) as T;
    } else {
      // blob
      return ((await res.blob()) as any) as T;
    }
  } catch (err) {
    emitSnackbar(err.toString(), { variant: "error" });
    throw err;
  } finally {
    dispatcher && dispatcher(loadingDec());
  }
};

export default RabbitFetch;

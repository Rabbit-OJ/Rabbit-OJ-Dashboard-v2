import axios, { ResponseType } from "axios";

import { emitLoadingDec, emitLoadingInc, emitSnackbar } from "../data/emitter";

export interface RabbitFetchParams {
  method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS";
  body?: Object | string;
  headers?: { [key: string]: string };
  responseType?: ResponseType;
  suppressErrorMessage?: boolean;
}

const RabbitFetch = async <T>(
  url: string,
  config: RabbitFetchParams = { method: "GET" }
): Promise<T> => {
  const responseType: ResponseType = config.responseType ?? "json";

  try {
    emitLoadingInc();

    const token = localStorage.getItem("token");
    let headers: { [key: string]: string } = config.headers ?? {};

    if (token) {
      headers = {
        ...headers,
        Authorization: token,
      };
    }

    const res = await axios({
      url,
      method: config.method,
      data: config.body,
      headers,
      responseType: responseType,
    });
    return res.data as T;
  } catch (err) {
    if (!config.suppressErrorMessage) {
      emitSnackbar(err.toString(), { variant: "error" });
    }

    throw err;
  } finally {
    emitLoadingDec();
  }
};

export default RabbitFetch;

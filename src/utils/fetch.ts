import { loadingDec, loadingInc } from "../data/actions";

const RabbitFetch = async (
  input: RequestInfo,
  init?: RequestInit & { dispatcher?: (action: any) => {} }
): Promise<Response> => {
  const dispatcher = init?.dispatcher;

  try {
    dispatcher && dispatcher(loadingInc());
    const res = await fetch(input, init);
    return res;
  } catch (err) {
    throw err;
  } finally {
    dispatcher && dispatcher(loadingDec());
  }
};

export default RabbitFetch;

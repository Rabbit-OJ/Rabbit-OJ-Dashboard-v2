import { EventEmitter } from "events";
import { SnackbarMessage, OptionsObject } from "notistack";

export const snackbarEmitter = new EventEmitter();
export const loadingEmitter = new EventEmitter();

export const emitLoadingInc = () => {
  loadingEmitter.emit("data", 1);
};

export const emitLoadingDec = () => {
  loadingEmitter.emit("data", -1);
};

export const emitSnackbar = (
  message: SnackbarMessage,
  options?: OptionsObject
) => {
  snackbarEmitter.emit("data", message, options);
};

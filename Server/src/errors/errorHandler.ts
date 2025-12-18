import { NextFunction, Request, Response } from "express";
import { CustomError, sendDevError, sendProdError } from "./CustomError";
import AppLogger from "../Logger/AppLogger";

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  let errorToHandle: CustomError;

  if (err instanceof CustomError || err.name === "CustomError") {
    console.log("Instance of CustomError detected");
    errorToHandle = err as CustomError;
  } else if (err instanceof Error) {
    AppLogger.logError("Non-CustomError detected. Wrapping it...");
    errorToHandle = new CustomError(
      err.message || "An unexpected error occurred",
      500,
      "server error",
      false
    );
  } else {
    AppLogger.logError("Unknown error type detected", err);

    errorToHandle = new CustomError(
      "An unknown error occurred",
      500,
      "server error",
      false
    );
  }
  const node_env = process.env.NODE_ENV;
  console.log("current NODE_ENV ", node_env);
  const isProd = node_env === "production";

  isProd
    ? sendProdError(errorToHandle, req, res)
    : sendDevError(errorToHandle, req, res);
};

export default errorHandler;

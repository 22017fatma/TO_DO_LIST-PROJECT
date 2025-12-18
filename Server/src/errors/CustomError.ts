/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";

export class CustomError extends Error {
  statusCode: number;
  status: "success" | "fail";
  safe: boolean;
  type: string;
  details?: string;
  errors?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number = 500,
    type: string = "server_error",
    safe: boolean = false,
    details?: string,
    errors?: Record<string, string>
  ) {
    super(message);
    this.name = "CustomError";
    Object.setPrototypeOf(this, CustomError.prototype);
    Error.captureStackTrace(this, this.constructor);

    this.statusCode = statusCode;
    this.status = statusCode >= 200 && statusCode < 300 ? "success" : "fail";
    this.safe = safe;
    this.details = details;
    this.type = type;
    this.errors = errors;
  }
}


export const sendDevError = (error: CustomError, _req: Request, res: Response) => {
  console.error("🚨 Error Details:", error);
  res.status(error.statusCode).json({
    status: error.status,
    statusCode: error.statusCode,
    message: error.message,
    stack: error.stack,
    type: error.type,
    details: error.details,
    errors: error.errors || {},
  });
};


export const sendProdError = (error: CustomError, _req: Request, res: Response) => {
  if (error.safe) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
      details: error.details,
      errors: error.errors || {},
    });
  } else {
    console.error("Critical Error (Hidden in Response)", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};


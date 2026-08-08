import { Request, Response, NextFunction } from "express";
import { config } from "../config/index.js";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";
import { CustomLogger } from "../utils/logger.js";

const handleZodError = (error: ZodError) => {
  const message = error.issues.map((issue) => issue.message).join(". ");
  // استفاده از متد create به جای new AppError
  return AppError.create(
    HttpCodes.BAD_REQUEST,
    AppCodes.INVALID_INPUT,
    message,
  );
};

const handleCastErrorDB = (err: any) => {
  const message = `Resource not found with id of ${err.value}`;
  return AppError.create(
    HttpCodes.BAD_REQUEST,
    AppCodes.INVALID_INPUT,
    message,
  );
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: "${value}". Please use another value!`;
  return AppError.create(
    HttpCodes.BAD_REQUEST,
    AppCodes.INVALID_INPUT,
    message,
  );
};

const sendErrorDev = (err: any, req: Request, res: Response) => {
  return res.status(err.statusCode || HttpCodes.INTERNAL_SERVER_ERROR).json({
    status: err.status || "error",
    appCode: err.appCode || AppCodes.INTERNAL_SERVER_ERROR,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      appCode: err.appCode,
      message: err.message,
    });
  }

  // B) Programming or other unknown error: don't leak error details
  // 1) Log error for developer-Pino
  CustomLogger.error(
    "GlobalErrorHandler",
    AppCodes.INTERNAL_SERVER_ERROR,
    err.message,
    {
      error: err,
      stack: err.stack,
    },
  );

  // 2) Send generic message to client
  return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    appCode: AppCodes.INTERNAL_SERVER_ERROR,
    message: "Something went very wrong!",
  });
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || HttpCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";
  err.message = err.message || "Internal Server Error";

  if (err.name === "ZodError") err = handleZodError(err);
  if (err.name === "CastError") err = handleCastErrorDB(err);
  if (err.code === 11000) err = handleDuplicateFieldsDB(err);

  if (config.nodeEnv === "development") {
    sendErrorDev(err, req, res);
  } else if (config.nodeEnv === "production") {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    sendErrorProd(error, req, res);
  }
};

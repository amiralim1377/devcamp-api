import { Request, Response, NextFunction } from "express";
import { config } from "../config/index.js";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";
import { CustomLogger } from "../utils/logger.js";

const handleZodError = (error: ZodError) => {
  const message = error.issues.map((issue) => issue.message).join(". ");
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
  return AppError.create(HttpCodes.CONFLICT, AppCodes.INVALID_INPUT, message);
};

const handleJWTError = () =>
  AppError.create(
    HttpCodes.UNAUTHORIZED,
    AppCodes.UNAUTHORIZED_ACCESS,
    "Invalid token. Please log in again!",
  );

const handleJWTExpiredError = () =>
  AppError.create(
    HttpCodes.UNAUTHORIZED,
    AppCodes.TOKEN_EXPIRED,
    "Your token has expired! Please log in again.",
  );

const sendErrorDev = (err: any, req: Request, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    appCode: err.appCode,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      appCode: err.appCode,
      message: err.message,
    });
  }

  CustomLogger.error(
    "GlobalErrorHandler",
    AppCodes.INTERNAL_SERVER_ERROR,
    err.message,
    {
      error: err,
      stack: err.stack,
    },
  );

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
  err.appCode = err.appCode || AppCodes.INTERNAL_SERVER_ERROR;
  err.message = err.message || "Internal Server Error";

  if (config.nodeEnv === "development") {
    sendErrorDev(err, req, res);
  } else if (config.nodeEnv === "production") {
    let error = Object.create(Object.getPrototypeOf(err));
    Object.assign(error, err);
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;

    if (error.name === "ZodError") error = handleZodError(error);
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

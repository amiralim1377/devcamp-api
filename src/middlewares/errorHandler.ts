import { Request, Response, NextFunction } from "express";
import { config } from "../config/index.js";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

const handleZodError = (error: ZodError) => {
  const message = error.issues.map((issue) => issue.message).join(". ");
  console.log(message);
  return new AppError(message, 400);
};

const handleCastErrorDB = (err: any) => {
  const message = `Resource not found with id of ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = Object.values(err.keyValue)[0];

  const message = `Duplicate field value: "${value}". Please use another value!`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: any, req: Request, res: Response) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || "error",
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
      message: err.message,
    });
  }

  // B) Programming or other unknown error: don't leak error details
  // 1) Log error for developer
  console.error("ERROR 💥", err);

  // 2) Send generic message to client
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
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

    sendErrorProd(error, req, res);
  }
};

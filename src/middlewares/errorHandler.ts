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

const sendErrorDev = (err: any, req: Request, res: Response) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) RENDERED WEBSITE
  console.error("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
  // 2) Send generic message
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
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
  err.message || "Internal Server Error";

  if (err.name === "ZodError") err = handleZodError(err);
  if (err.name === "CastError") err = handleCastErrorDB(err);

  if (config.nodeEnv === "development") {
    sendErrorDev(err, req, res);
  } else if (config.nodeEnv === "production") {
    let error = { ...err };
    error.message = err.message;

    sendErrorProd(error, req, res);
  }
};

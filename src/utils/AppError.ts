import { HttpCodes } from "./HttpCodes.js";
import { AppCodes } from "./AppCodes.js";
import { CustomLogger } from "./logger.js";

export class AppError extends Error {
  public status: string;
  public isOperational: boolean;

  private constructor(
    public statusCode: HttpCodes,
    public appCode: AppCodes,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static throwError(
    caller: string,
    statusCode: HttpCodes,
    appCode: AppCodes,
    message: string,
    details?: Record<string, unknown>,
  ): never {
    const error = new AppError(statusCode, appCode, message, details);

    CustomLogger.error(caller, error.appCode, error.message, {
      statusCode: error.statusCode,
      status: error.status,
      ...error.details,
      stack: error.stack,
    });

    throw error;
  }

  static create(
    statusCode: HttpCodes,
    appCode: AppCodes,
    message: string,
    details?: Record<string, unknown>,
  ): AppError {
    return new AppError(statusCode, appCode, message, details);
  }
}

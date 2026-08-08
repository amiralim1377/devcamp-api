import pino from "pino";
import { AppCodes } from "./AppCodes.js";
import { config } from "../config/index.js";

export const pinoLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    config.nodeEnv !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});

export class CustomLogger {
  static info(
    caller: string,
    code: AppCodes,
    message?: string,
    details?: Record<string, unknown>,
  ) {
    pinoLogger.info({ caller, code, ...details }, message || code);
  }

  static error(
    caller: string,
    code: AppCodes,
    message?: string,
    details?: Record<string, unknown>,
  ) {
    pinoLogger.error({ caller, code, ...details }, message || code);
  }

  static warn(
    caller: string,
    code: AppCodes,
    message?: string,
    details?: Record<string, unknown>,
  ) {
    pinoLogger.warn({ caller, code, ...details }, message || code);
  }
}

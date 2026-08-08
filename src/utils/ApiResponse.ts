import { Response } from "express";
import { HttpCodes } from "./HttpCodes.js";

export class ApiResponse<T> {
  private constructor(
    private res: Response,
    private statusCode: HttpCodes,
    private message: string,
    private data?: T,
    private meta?: Record<string, unknown>,
  ) {}

  static send<T>(
    res: Response,
    statusCode: HttpCodes,
    message: string,
    data?: T,
    meta?: Record<string, unknown>,
  ) {
    const response = new ApiResponse(res, statusCode, message, data, meta);

    return response.res.status(response.statusCode).json({
      status: "success",
      message: response.message,
      ...(response.data && { data: response.data }),
      ...(response.meta && { meta: response.meta }),
    });
  }
}

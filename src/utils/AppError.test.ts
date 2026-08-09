import { describe, it, expect, Mock, vi, afterEach } from "vitest";
import { AppCodes } from "./AppCodes.js";
import { AppError } from "./AppError.js";
import { HttpCodes } from "./HttpCodes.js";
import { CustomLogger } from "./logger.js";

describe("AppError Class", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("create() method", () => {
    it("should create an AppError instance with correct properties", () => {
      // arrange
      const statusCode = HttpCodes.BAD_REQUEST;
      const appCode = AppCodes.INVALID_INPUT;
      const message = "this is a test error";

      //   act
      const actual = AppError.create(statusCode, appCode, message);

      //   assert
      expect(actual.message).toBe("this is a test error");
      expect(actual.statusCode).toBe(400);
      expect(actual.appCode).toBe("ERR_GEN_001");
      expect(actual.isOperational).toBeTruthy();
      expect(actual.details).toBeUndefined();
      expect(actual.name).toBe("AppError");
      expect(actual).toBeInstanceOf(AppError);
    });
    it("should create an AppError instance with correct properties", () => {
      // arrange
      const statusCode = HttpCodes.INTERNAL_SERVER_ERROR;
      const appCode = AppCodes.INTERNAL_SERVER_ERROR;
      const message = "Internal Server Error";

      // act
      const actual = AppError.create(statusCode, appCode, message);

      expect(actual.isOperational).toBeTruthy();
      expect(actual.appCode).toBe("ERR_GEN_500");
      expect(actual.statusCode).toBe(500);
      expect(actual.status).toBe("error");
    });
  });

  describe("throwError() method", () => {
    let customLoggerSpy: Mock;
    customLoggerSpy = vi
      .spyOn(CustomLogger, "error")
      .mockImplementation(() => {});

    it("should throw an AppError with correct properties", () => {
      // arrenge
      const caller = "UserService.getUser";
      const statusCode = HttpCodes.NOT_FOUND;
      const appCode = AppCodes.USER_NOT_FOUND;
      const message = "کاربر یافت نشد";
      const details = { field: "email", reason: "already exists" };

      try {
        AppError.throwError(caller, statusCode, appCode, message, details);

        expect.fail("Expected an error to be thrown");
      } catch (error: any) {
        // check if logger caleed or not ?
        expect(customLoggerSpy).toHaveBeenCalledWith(
          "UserService.getUser",
          AppCodes.USER_NOT_FOUND,
          "کاربر یافت نشد",
          expect.objectContaining({
            statusCode: 404,
            status: "fail",
            field: "email",
            reason: "already exists",
          }),
        );

        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("کاربر یافت نشد");
        expect(error.details).toEqual({
          field: "email",
          reason: "already exists",
        });
      }
    });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { protect, restrictTo } from "./auth.middleware.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { config } from "../config/index.js";

describe("Auth Middleware", () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;
  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      cookies: {},
      headers: {},
    };
    mockRes = {};
    mockNext = vi.fn();
  });

  describe("protect middleware", () => {
    it("should throw an error if no token is provided in cookies or headers", async () => {
      // 2. Act & 3. Assert:
      await expect(protect(mockReq, mockRes, mockNext)).rejects.toThrow(
        "You are not logged in! Please log in to get access.",
      );
    });
    it("should attach user to req and call next if token is valid and user exists", async () => {
      // 1. Arrange
      mockReq.cookies.access_token = "valid_fake_access_token";

      // this is a sync-function
      const jwtSpy = vi
        .spyOn(jwt, "verify")
        .mockReturnValue({ id: "user123" } as any);

      // dataBase-mock
      const mockUser = {
        _id: "user123",
        name: "amirali Moradi",
        email: "alimoradi7718@gmail.com",
      };
      const userSpy = vi
        .spyOn(User, "findById")
        .mockResolvedValue(mockUser as any);

      // 2. Act
      await protect(mockReq, mockRes, mockNext);

      // 3. Assert
      expect(jwtSpy).toHaveBeenCalledWith(
        "valid_fake_access_token",
        config.jwtSecret,
      );
      expect(userSpy).toHaveBeenCalledWith("user123");

      expect(mockReq.user).toStrictEqual({
        _id: "user123",
        name: "amirali Moradi",
        email: "alimoradi7718@gmail.com",
      });

      expect(mockNext).toHaveBeenCalledTimes(1);
    });
    it("should extract token from headers if it is not in cookies", async () => {
      // arrange
      // this is a sync-function
      const fakeToken = "valid_fake_access_token";
      // this is a sync-function
      const jwtSpy = vi
        .spyOn(jwt, "verify")
        .mockReturnValue({ id: "user123" } as any);

      mockReq.headers.authorization = `Bearer ${fakeToken}`;

      // dataBase-mock
      const mockUser = {
        _id: "user123",
        name: "amirali Moradi",
        email: "alimoradi7718@gmail.com",
      };
      const userSpy = vi
        .spyOn(User, "findById")
        .mockResolvedValue(mockUser as any);

      // 2. Act
      await protect(mockReq, mockRes, mockNext);

      //   asert
      expect(jwtSpy).toHaveBeenCalledWith(
        "valid_fake_access_token",
        config.jwtSecret,
      );
    });

    it("should throw an error if token is valid but user no longer exists in DB", async () => {
      // arrange
      const fakeToken = "valid_fake_access_token";
      mockReq.headers.authorization = `Bearer ${fakeToken}`;

      // this is a sync-function
      const jwtSpy = vi
        .spyOn(jwt, "verify")
        .mockReturnValue({ id: "user123" } as any);

      const userSpy = vi.spyOn(User, "findById").mockResolvedValue(null);

      await expect(protect(mockReq, mockRes, mockNext)).rejects.toThrow(
        "The user belonging to this token does no longer exist.",
      );
    });
  });

  describe("restrictTo middleware", () => {
    it("should throw an error if req.user is undefined", () => {
      // arrange
      const fakeRole = "user";

      mockReq.user = undefined;
      //act and assert

      const restrictToMiddlewate = restrictTo(fakeRole);

      expect(() => restrictToMiddlewate(mockReq, mockRes, mockNext)).toThrow(
        "You are not logged in.",
      );
    });

    it("should throw an error if user role is not included in allowed roles", () => {
      // arrange
      const allowRole = "admin";
      mockReq.user = { role: "user" };

      const restrictToMiddlewate = restrictTo(allowRole);

      expect(() => {
        restrictToMiddlewate(mockReq, mockRes, mockNext);
      }).toThrow("You do not have permission to perform this action.");
    });

    it("should call next if user role is authorized", () => {
      const allowRole = "admin";
      mockReq.user = { role: "admin" };

      const restrictToMiddlewate = restrictTo(allowRole);
      restrictToMiddlewate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});

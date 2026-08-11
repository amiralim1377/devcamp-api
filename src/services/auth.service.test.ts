import { describe, it, expect, vi, beforeEach, vitest } from "vitest";
import authService from "./auth.service.js";
import User from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import crypto from "crypto";

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signup method", () => {
    it("should successfully create a new user and return it", async () => {
      // Arrange
      const fakeUserData = { email: "test@gmail.com", password: "test1234" };
      const fakeCreatedUser = {
        _id: "123",
        name: "test-user",
        email: "test@gmail.com",
      };
      const createUserSpy = vi
        .spyOn(User, "create")
        .mockResolvedValue(fakeCreatedUser as any);

      // act
      const actual = await authService.signup(fakeUserData);

      //   assert
      expect(createUserSpy).toHaveBeenCalledTimes(1);
      expect(createUserSpy).toHaveBeenCalledWith(fakeUserData);
      expect(actual).toEqual(fakeCreatedUser);
    });
  });

  describe("login method", () => {
    it("should throw an error if user is not found by email", async () => {
      const fakeUserData = {
        email: "wrongEmail@gmail.com",
        password: "true-password",
      };

      const findOneUserSpy = vi.spyOn(User, "findOne").mockReturnValue({
        select: vi.fn().mockResolvedValue(null),
      } as any);

      await expect(
        authService.login(fakeUserData.email, fakeUserData.password),
      ).rejects.toThrow("Incorrect email or password");

      expect(findOneUserSpy).toHaveBeenCalledTimes(1);
      expect(findOneUserSpy).toHaveBeenCalledWith({
        email: fakeUserData.email,
      });
    });

    it("should throw an error if password is incorrect", async () => {
      // Arrange
      const fakeUserData = {
        email: "test@gmail.com",
        password: "wrong-password",
      };
      //   in dataBase
      const mockUser = {
        email: fakeUserData.email,
        password: "hashed-true-password",
        correctPassword: vi.fn().mockResolvedValue(false),
      };
      const findOneUserSpy = vi.spyOn(User, "findOne").mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      } as any);
      // 2 & 3. Act & Assert
      await expect(
        authService.login(fakeUserData.email, fakeUserData.password),
      ).rejects.toThrow("Incorrect email or password");

      expect(findOneUserSpy).toHaveBeenCalledWith({
        email: fakeUserData.email,
      });
      expect(mockUser.correctPassword).toHaveBeenCalledWith(
        fakeUserData.password,
        mockUser.password,
      );
    });

    it("should return the user if email and password are correct", async () => {
      // Arrange
      const fakeUserData = {
        email: "test@gmail.com",
        password: "true-password",
      };
      //   in dataBase
      const mockUser = {
        email: fakeUserData.email,
        password:
          "hashed-true-password but is correct with fakeUserData.password",
        correctPassword: vi.fn().mockResolvedValue(true),
      };

      const findOneUserSpy = vi.spyOn(User, "findOne").mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      } as any);

      //   act
      const actual = await authService.login(
        fakeUserData.email,
        fakeUserData.password,
      );

      expect(findOneUserSpy).toHaveBeenCalledTimes(1);
      expect(findOneUserSpy).toHaveBeenCalledWith({
        email: fakeUserData.email,
      });
      expect(actual).toEqual(mockUser);
      expect(mockUser.correctPassword).toHaveBeenCalledWith(
        fakeUserData.password,
        mockUser.password,
      );
    });
  });

  describe("logout method", () => {
    it("should hash the refresh token and update the session as revoked", async () => {
      // Arrange
      const fakeToken = "my-refresh-token";
      const fakeTokenHash = crypto
        .createHash("sha256")
        .update(fakeToken)
        .digest("hex");

      const sessionFindAndUpdateSpy = vi
        .spyOn(Session, "findOneAndUpdate")
        .mockResolvedValue(null);

      //   act
      authService.logout(fakeToken);

      //   assert
      expect(sessionFindAndUpdateSpy).toHaveBeenCalledWith(
        { tokenHash: fakeTokenHash, revokedAt: null },
        { revokedAt: expect.any(Date) },
      );
    });
  });

  describe("refreshSession method", () => {
    it("should throw an error if session is not found or already revoked", async () => {
      // Arrange
      const fakerefreshToken = "this_is_fake_refreshToken";

      const refreshTokenHash = crypto
        .createHash("sha256")
        .update(fakerefreshToken)
        .digest("hex");

      const sessionFindOneSpy = vi
        .spyOn(Session, "findOne")
        .mockResolvedValue(null);

      // 3)Act & Assert
      await expect(
        authService.refreshSession(fakerefreshToken),
      ).rejects.toThrow("Session expired");

      expect(sessionFindOneSpy).toHaveBeenCalledWith({
        tokenHash: refreshTokenHash,
        revokedAt: null,
      });
    });

    it("should throw an error if user belonging to session no longer exists", async () => {});

    it("should update lastUsedAt and return the user if everything is valid", async () => {});
  });

  describe("updatePassword method", () => {
    it("should throw an error if user is not found", async () => {});

    it("should throw an error if current password is wrong", async () => {});

    it("should update password, revoke sessions, and return user", async () => {});
  });
});

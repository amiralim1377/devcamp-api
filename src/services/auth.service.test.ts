import { describe, it, expect, vi, beforeEach } from "vitest";
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

    it("should throw an error if user belonging to session no longer exists", async () => {
      // Arrange
      const fakerefreshToken = "this_is_fake_refreshToken";

      const mockSession = { user: "fakeUserId" };

      const refreshTokenHash = crypto
        .createHash("sha256")
        .update(fakerefreshToken)
        .digest("hex");

      const sessionFindOneSpy = vi
        .spyOn(Session, "findOne")
        .mockResolvedValue(mockSession as any);

      const userFindById = vi.spyOn(User, "findById").mockResolvedValue(null);

      await expect(
        authService.refreshSession(fakerefreshToken),
      ).rejects.toThrow("User no longer exists");

      expect(sessionFindOneSpy).toHaveBeenCalledWith({
        tokenHash: refreshTokenHash,
        revokedAt: null,
      });

      expect(userFindById).toHaveBeenCalledWith(mockSession.user);
    });

    it("should update lastUsedAt and return the user if everything is valid-Happy Path", async () => {
      // Arrange
      const fakerefreshToken = "this_is_fake_refreshToken";

      const mockSession = {
        user: "fakeUserId",
        lastUsedAt: null,
        save: vi.fn().mockResolvedValue(true),
      };

      const mockUser = {
        _id: "fakeUserId",
        name: "test-user",
      };

      const refreshTokenHash = crypto
        .createHash("sha256")
        .update(fakerefreshToken)
        .digest("hex");

      const sessionFindOneSpy = vi
        .spyOn(Session, "findOne")
        .mockResolvedValue(mockSession as any);

      const userFindByIdSpy = vi
        .spyOn(User, "findById")
        .mockResolvedValue(mockUser as any);

      const actual = await authService.refreshSession(fakerefreshToken);

      expect(sessionFindOneSpy).toHaveBeenCalledWith({
        tokenHash: refreshTokenHash,
        revokedAt: null,
      });
      expect(userFindByIdSpy).toHaveBeenCalledWith(mockSession.user);
      expect(actual).toEqual(mockUser);
      expect(mockSession.save).toHaveBeenCalledTimes(1);
      expect(mockSession.lastUsedAt).toBeInstanceOf(Date);
    });
  });

  describe("updatePassword method", () => {
    it("should throw an error if user is not found", async () => {
      const findOneUserSpy = vi.spyOn(User, "findById").mockReturnValue({
        select: vi.fn().mockResolvedValue(null),
      } as any);

      const fakeUserId = "fake_user_id";
      const fakeCurrentPass = "fake_current_password";
      const fakeNewPass = "fake_New_password";

      await expect(
        authService.updatePassword(fakeUserId, fakeCurrentPass, fakeNewPass),
      ).rejects.toThrow("User not found");

      expect(findOneUserSpy).toHaveBeenCalledWith(fakeUserId);
    });

    it("should throw an error if current password is wrong", async () => {
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
      const findOneUserSpy = vi.spyOn(User, "findById").mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      } as any);

      const fakeUserId = "fake_user_id";
      const fakeCurrentPass = "fake_current_password";
      const fakeNewPass = "fake_New_password";

      await expect(
        authService.updatePassword(fakeUserId, fakeCurrentPass, fakeNewPass),
      ).rejects.toThrow("Incorrect current password");

      expect(mockUser.correctPassword).toHaveBeenCalledWith(
        fakeCurrentPass,
        mockUser.password,
      );
    });

    it("should update password, revoke sessions, and return user-Happy Path", async () => {
      // 1. Arrange
      const fakeUserId = "fake_user_id";
      const fakeCurrentPass = "fake_current_password";
      const fakeNewPass = "fake_New_password";

      const mockUser = {
        password: "old-hashed-password",
        correctPassword: vi.fn().mockResolvedValue(true),
        save: vi.fn().mockResolvedValue(true),
      };

      const findByIdSpy = vi.spyOn(User, "findById").mockReturnValue({
        select: vi.fn().mockResolvedValue(mockUser),
      } as any);

      const sessionUpdateManySpy = vi
        .spyOn(Session, "updateMany")
        .mockResolvedValue(null as any);

      // 2. Act
      const actual = await authService.updatePassword(
        fakeUserId,
        fakeCurrentPass,
        fakeNewPass,
      );

      // 3. Assert
      expect(mockUser.correctPassword).toHaveBeenCalledWith(
        fakeCurrentPass,
        "old-hashed-password",
      );

      expect(mockUser.password).toBe(fakeNewPass);

      expect(mockUser.save).toHaveBeenCalledTimes(1);

      expect(sessionUpdateManySpy).toHaveBeenCalledWith(
        { user: fakeUserId, revokedAt: null },
        { revokedAt: expect.any(Date) },
      );

      expect(actual).toEqual(mockUser);
    });
  });
});

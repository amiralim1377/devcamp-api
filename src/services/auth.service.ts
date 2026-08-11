import { Session } from "../models/session.model.js";
import User, { IUser } from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";
import crypto from "crypto";

class AuthService {
  async signup(userData: Partial<IUser>) {
    const newUser = await User.create(userData);
    return newUser;
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password");

    if (
      !user ||
      !(await user.correctPassword(password, user.password as string))
    ) {
      AppError.throwError(
        "AuthService.login",
        HttpCodes.UNAUTHORIZED,
        AppCodes.INVALID_CREDENTIALS,
        "Incorrect email or password",
      );
    }
    return user;
  }

  async logout(refreshToken: string) {
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await Session.findOneAndUpdate(
      { tokenHash: refreshTokenHash, revokedAt: null },
      { revokedAt: new Date() },
    );
  }

  async refreshSession(refreshToken: string) {
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await Session.findOne({
      tokenHash: refreshTokenHash,
      revokedAt: null,
    });

    if (!session) {
      AppError.throwError(
        "AuthService.refreshSession",
        HttpCodes.UNAUTHORIZED,
        AppCodes.TOKEN_EXPIRED,
        "Session expired",
      );
    }

    const user = await User.findById(session.user);
    if (!user) {
      AppError.throwError(
        "AuthService.refreshSession",
        HttpCodes.UNAUTHORIZED,
        AppCodes.USER_NOT_FOUND,
        "User no longer exists",
      );
    }

    session.lastUsedAt = new Date();
    await session.save();

    return user;
  }

  async updatePassword(userId: string, currentPass: string, newPass: string) {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      AppError.throwError(
        "AuthService.updatePassword",
        HttpCodes.NOT_FOUND,
        AppCodes.USER_NOT_FOUND,
        "User not found",
      );
    }

    const isMatch = await user.correctPassword(currentPass, user.password);

    if (!isMatch) {
      AppError.throwError(
        "AuthService.updatePassword",
        HttpCodes.UNAUTHORIZED,
        AppCodes.INVALID_CREDENTIALS,
        "Incorrect current password",
      );
    }

    user.password = newPass;

    await user.save();

    await Session.updateMany(
      { user: userId, revokedAt: null },
      { revokedAt: new Date() },
    );

    return user;
  }
}

export default new AuthService();

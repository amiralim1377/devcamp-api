import { Session } from "../models/session.model.js";
import User, { IUser } from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
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
      throw new AppError("Incorrect email or password", 401);
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
      throw new AppError("Session expired", 401);
    }

    const user = await User.findById(session.user);
    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    session.lastUsedAt = new Date();
    await session.save();

    return user;
  }
}

export default new AuthService();

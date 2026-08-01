import { Request, Response, NextFunction, CookieOptions } from "express";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { createSendToken } from "../utils/createSendToken.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/index.js";
import crypto from "crypto";
import { Session } from "../models/session.model.js";
import { signToken } from "../utils/signToken.js";

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    const newUser = await User.create(req.body);

    createSendToken(newUser, 201, req, res);
  }
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (
      !user ||
      !(await user.correctPassword(password, user.password as string))
    ) {
      return next(new AppError("Incorrect email or password", 401));
    }
    createSendToken(user, 200, req, res);
  }
  async protect(req: Request, res: Response, next: NextFunction) {
    try {
      let token;

      if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
      }

      if (!token) {
        return next(
          new AppError(
            "You are not logged in! Please log in to get access.",
            401,
          ),
        );
      }

      const decoded = jwt.verify(
        token,
        config.jwtSecret as string,
      ) as jwt.JwtPayload;

      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next(
          new AppError(
            "The user belonging to this token does no longer exist.",
            401,
          ),
        );
      }

      req.user = currentUser;
      next();
    } catch (error) {
      return next(
        new AppError("Invalid or expired token! Please log in again.", 401),
      );
    }
  }
  restrictTo(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new AppError("You are not logged in.", 401));
      }

      if (!roles.includes(req.user.role)) {
        return next(
          new AppError(
            "You do not have permission to perform this action.",
            403,
          ),
        );
      }

      next();
    };
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {
      const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      await Session.findOneAndUpdate(
        { tokenHash: refreshTokenHash, revokedAt: null },
        { revokedAt: new Date() },
      );
    }

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: config.nodeEnv === "production" ? "none" : "lax",
    };

    res.cookie("access_token", "loggedout", {
      ...cookieOptions,
      expires: new Date(Date.now() + 10 * 1000),
    });

    res.cookie("refresh_token", "loggedout", {
      ...cookieOptions,
      expires: new Date(Date.now() + 10 * 1000),
    });

    res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  }
  async refresh(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return next(
        new AppError(
          "You are not logged in! Please log in to get access.",
          401,
        ),
      );
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await Session.findOne({
      tokenHash: refreshTokenHash,
      revokedAt: null,
    });

    if (!session) {
      return next(new AppError("Session expired", 401));
    }

    const user = await User.findById(session.user);

    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    const accessToken = signToken(user._id.toString());

    const accessTokenExpiresAt = new Date(
      Date.now() + Number(config.jwtExpiresIn) * 60 * 1000,
    );

    const cookieOptions: CookieOptions = {
      httpOnly: true,

      secure: config.nodeEnv === "production",

      sameSite: config.nodeEnv === "production" ? "none" : "lax",

      expires: accessTokenExpiresAt,
    };

    res.cookie("access_token", accessToken, cookieOptions);

    // Update session activity
    session.lastUsedAt = new Date();

    await session.save();

    res.status(200).json({
      status: "success",
      message: "Access token refreshed successfully",
    });
  }
}

export default new AuthController();

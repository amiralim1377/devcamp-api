import { Response, Request, CookieOptions } from "express";
import { config } from "../config/index.js";
import { IUser } from "../models/user.model.js";
import { signToken } from "./signToken.js";
import crypto from "crypto";
import { Session } from "../models/session.model.js";
import { HttpCodes } from "./HttpCodes.js";
import { ApiResponse } from "./ApiResponse.js";

// user, statusCode, req, res
export const createSendToken = async (
  user: IUser,
  statusCode: HttpCodes,
  req: Request,
  res: Response,
) => {
  // 1) Create Access Token (JWT)
  const accessToken = signToken(user._id.toString());

  // 2) Create Refresh Token (Opaque Token)
  const refreshToken = crypto.randomBytes(64).toString("hex");

  // 3) Hash Refresh Token
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Expiration Dates
  const refreshTokenExpiresAt = new Date(
    Date.now() + Number(config.jwtRefreshExpiresIn) * 24 * 60 * 60 * 1000,
  );
  const accessTokenExpiresAt = new Date(
    Date.now() + Number(config.jwtExpiresIn) * 60 * 1000,
  );

  //  4) Create Session in Database
  await Session.create({
    user: user._id,
    tokenHash: refreshTokenHash,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    expiresAt: refreshTokenExpiresAt,
  });

  // 5) Cookie Configuration
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
  };
  // Send Access Token Cookie
  res.cookie("access_token", accessToken, {
    ...cookieOptions,

    expires: accessTokenExpiresAt,
  });
  // Send Refresh Token Cookie
  res.cookie("refresh_token", refreshToken, {
    ...cookieOptions,

    expires: refreshTokenExpiresAt,
  });

  // Send standardized response
  ApiResponse.send(res, statusCode, "عملیات با موفقیت انجام شد", { user });
};

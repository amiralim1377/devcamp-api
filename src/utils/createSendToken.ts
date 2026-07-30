import { Response, Request, CookieOptions } from "express";
import { config } from "../config/index.js";
import { IUser } from "../models/user.model.js";
import { signToken } from "./signToken.js";

// user, statusCode, req, res
export const createSendToken = (
  user: IUser,
  statusCode: number,
  req: Request,
  res: Response,
) => {
  const token = signToken(user._id.toString());

  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() + Number(config.jwtCookieExpiresIn) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (config.nodeEnv === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

import { Response, CookieOptions } from "express";
import { config } from "../config/index.js";
import { IUser } from "../models/user.model.js";
import { signToken } from "./signToken.js";

export const createSendToken = (
  user: IUser,
  statusCode: number,
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

  // remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

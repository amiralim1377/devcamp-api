import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { config } from "../config/index.js";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;

  if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    AppError.throwError(
      "protect Middleware",
      HttpCodes.UNAUTHORIZED,
      AppCodes.UNAUTHORIZED_ACCESS,
      "You are not logged in! Please log in to get access.",
    );
  }

  const decoded = jwt.verify(
    token,
    config.jwtSecret as string,
  ) as jwt.JwtPayload;

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    AppError.throwError(
      "protect Middleware",
      HttpCodes.UNAUTHORIZED,
      AppCodes.UNAUTHORIZED_ACCESS,
      "The user belonging to this token does no longer exist.",
    );
  }

  req.user = currentUser;
  next();
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      AppError.throwError(
        "restrictTo Middleware",
        HttpCodes.UNAUTHORIZED,
        AppCodes.UNAUTHORIZED_ACCESS,
        "You are not logged in.",
      );
    }

    if (!roles.includes(req.user.role)) {
      AppError.throwError(
        "restrictTo Middleware",
        HttpCodes.FORBIDDEN,
        AppCodes.FORBIDDEN_ACCESS,
        "You do not have permission to perform this action.",
      );
    }

    next();
  };
};

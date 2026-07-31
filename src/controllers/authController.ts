import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { createSendToken } from "../utils/createSendToken.js";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

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
}

export default new AuthController();

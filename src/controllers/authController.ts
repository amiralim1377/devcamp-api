import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { createSendToken } from "../utils/createSendToken.js";

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
}

export default new AuthController();

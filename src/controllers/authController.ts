import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { createSendToken } from "../utils/createSendToken.js";

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    const { name, password, email, passwordConfirm } = req.body;

    if (!email || !password || !name) {
      return next(new AppError("Please provide email and password", 400));
    }

    const newUser = await User.create({
      name,
      password,
      email,
      passwordConfirm,
    });

    createSendToken(newUser, 201, req, res);
  }
}

export default new AuthController();

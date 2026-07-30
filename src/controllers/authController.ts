import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    const { name, password, email } = req.body;

    if (!email || !password || !name) {
      return next(new AppError("Please provide email and password", 400));
    }

    const newUser = await User.create({ name, password, email });

    res.status(200).json({
      status: "success",
      message: "user created",
    });
  }
}

export default new AuthController();

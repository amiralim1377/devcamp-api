import { Request, Response, NextFunction, CookieOptions } from "express";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { createSendToken } from "../utils/createSendToken.js";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

import { signToken } from "../utils/signToken.js";
import authService from "../services/auth.service.js";

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await authService.signup(req.body);
      createSendToken(newUser, 201, req, res);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      createSendToken(user, 200, req, res);
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (refreshToken) {
        await authService.logout(refreshToken);
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
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        return next(
          new AppError(
            "You are not logged in! Please log in to get access.",
            401,
          ),
        );
      }

      const user = await authService.refreshSession(refreshToken);
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

      res.status(200).json({
        status: "success",
        message: "Access token refreshed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id.toString();
      const { currentPassword, newPassword } = req.body;

      const user = await authService.updatePassword(
        userId,
        currentPassword,
        newPassword,
      );
      createSendToken(user, 200, req, res);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {}

  async resetPassword(req: Request, res: Response, next: NextFunction) {}
}

export default new AuthController();

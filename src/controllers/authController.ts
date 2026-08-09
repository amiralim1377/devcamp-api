import { Request, Response, CookieOptions } from "express";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { createSendToken } from "../utils/createSendToken.js";
import { config } from "../config/index.js";
import { signToken } from "../utils/signToken.js";
import authService from "../services/auth.service.js";
import sendEmail from "../utils/email.js";
import crypto from "crypto";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";
import { ApiResponse } from "../utils/ApiResponse.js";

class AuthController {
  async signup(req: Request, res: Response) {
    const newUser = await authService.signup(req.body);
    createSendToken(newUser, HttpCodes.CREATED, req, res);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    createSendToken(user, HttpCodes.OK, req, res);
  }

  async logout(req: Request, res: Response) {
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

    ApiResponse.send(res, HttpCodes.OK, "Logged out successfully");
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      AppError.throwError(
        "AuthController.refresh",
        HttpCodes.UNAUTHORIZED,
        AppCodes.UNAUTHORIZED_ACCESS,
        "You are not logged in! Please log in to get access.",
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

    ApiResponse.send(res, HttpCodes.OK, "Access token refreshed successfully");
  }
  async updatePassword(req: Request, res: Response) {
    const userId = req.user!._id.toString();
    const { currentPassword, newPassword } = req.body;

    const user = await authService.updatePassword(
      userId,
      currentPassword,
      newPassword,
    );
    createSendToken(user, HttpCodes.OK, req, res);
  }

  async forgotPassword(req: Request, res: Response) {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      AppError.throwError(
        "AuthController.forgotPassword",
        HttpCodes.NOT_FOUND,
        AppCodes.USER_NOT_FOUND,
        "کاربری با این ایمیل یافت نشد.",
      );
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `فراموشی رمز عبور 🔒\n\nبرای تنظیم مجدد رمز عبور خود، لطفاً یک درخواست PUT به همراه رمز عبور جدید به آدرس زیر ارسال کنید:\n\n${resetURL}\n\nاگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "توکن بازیابی رمز عبور (معتبر برای ۱۰ دقیقه)",
        message,
      });

      ApiResponse.send(
        res,
        HttpCodes.OK,
        "توکن بازیابی به ایمیل شما ارسال شد.",
      );
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      AppError.throwError(
        "AuthController.forgotPassword",
        HttpCodes.INTERNAL_SERVER_ERROR,
        AppCodes.INTERNAL_SERVER_ERROR,
        "خطا در ارسال ایمیل. لطفاً دوباره تلاش کنید.",
        { originalError: error },
      );
    }
  }

  async resetPassword(req: Request, res: Response) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token as string)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      AppError.throwError(
        "AuthController.resetPassword",
        HttpCodes.BAD_REQUEST,
        AppCodes.TOKEN_EXPIRED,
        "توکن نامعتبر است یا منقضی شده است.",
      );
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    ApiResponse.send(
      res,
      HttpCodes.OK,
      "رمز عبور با موفقیت تغییر کرد. اکنون می‌توانید وارد شوید.",
    );
  }
}

export default new AuthController();

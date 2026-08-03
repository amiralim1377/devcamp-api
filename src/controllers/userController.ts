import { NextFunction, Response, Request } from "express";
import userService from "../services/user.service.js";
import { AppError } from "../utils/AppError.js";

class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers(req.query);
      res.status(200).json({
        status: "success",
        results: users.length,
        data: { users },
      });
    } catch (error) {
      next(error);
    }
  }

  async getSingleUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id as string;

      const user = await userService.getUser(userId);
      res.status(200).json({
        status: "success",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  }
  async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id.toString();

      console.log("userId", userId);

      await userService.deleteMe(userId);
      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json({
        status: "success",
        data: { user: newUser },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.password || req.body.passwordConfirm) {
        return next(
          new AppError("ادمین نمی‌تواند رمز عبور کاربران را تغییر دهد.", 400),
        );
      }

      const userId = req.params.id as string;
      const updatedUser = await userService.updateUser(userId, req.body);

      res.status(200).json({
        status: "success",
        data: { user: updatedUser },
      });
    } catch (error) {
      next(error);
    }
  }
  async updateDetails(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError("این مسیر برای تغییر رمز عبور نیست.", 400));
      }

      const userId = req.user!._id.toString();
      const updatedUser = await userService.updateUser(userId, req.body);

      res.status(200).json({
        status: "success",
        data: { user: updatedUser },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id as string;

      await userService.deleteUser(userId);
      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();

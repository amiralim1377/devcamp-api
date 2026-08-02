import { NextFunction, Response, Request } from "express";
import userService from "../services/user.service.js";

class UserController {
  async getMe(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  }

  async updateDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id.toString();

      const updatedUser = await userService.updateDetails(userId, req.body);
      res.status(200).json({
        status: "success",
        data: {
          user: updatedUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();

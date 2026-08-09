import { Response, Request } from "express";
import userService from "../services/user.service.js";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";

class UserController {
  async getAllUsers(req: Request, res: Response) {
    const users = await userService.getAllUsers(req.query);
    ApiResponse.send(
      res,
      HttpCodes.OK,
      "Users retrieved successfully.",
      { users },
      { results: users.length },
    );
  }

  async getSingleUser(req: Request, res: Response) {
    const userId = req.params.id as string;

    const user = await userService.getUser(userId);
    ApiResponse.send(res, HttpCodes.OK, "User retrieved successfully.", {
      user,
    });
  }

  async getMe(req: Request, res: Response) {
    ApiResponse.send(
      res,
      HttpCodes.OK,
      "User profile retrieved successfully.",
      {
        user: req.user,
      },
    );
  }
  async deleteMe(req: Request, res: Response) {
    const userId = req.user!._id.toString();

    await userService.deleteMe(userId);
    ApiResponse.send(res, HttpCodes.NO_CONTENT, "User deleted successfully.");
  }

  async createUser(req: Request, res: Response) {
    const newUser = await userService.createUser(req.body);
    ApiResponse.send(res, HttpCodes.CREATED, "User created successfully.", {
      user: newUser,
    });
  }

  async updateUser(req: Request, res: Response) {
    if (req.body.password || req.body.passwordConfirm) {
      AppError.throwError(
        "UserController.updateUser",
        HttpCodes.BAD_REQUEST,
        AppCodes.INVALID_INPUT,
        "Admin cannot change user passwords.",
      );
    }

    const userId = req.params.id as string;
    const updatedUser = await userService.updateUser(userId, req.body);

    ApiResponse.send(res, HttpCodes.OK, "User updated successfully.", {
      user: updatedUser,
    });
  }

  async updateDetails(req: Request, res: Response) {
    if (req.body.password || req.body.passwordConfirm) {
      AppError.throwError(
        "UserController.updateDetails",
        HttpCodes.BAD_REQUEST,
        AppCodes.INVALID_INPUT,
        "This route is not for password updates.",
      );
    }
    const userId = req.user!._id.toString();
    const updatedUser = await userService.updateUser(userId, req.body);

    ApiResponse.send(res, HttpCodes.OK, "User details updated successfully.", {
      user: updatedUser,
    });
  }

  async deleteUser(req: Request, res: Response) {
    const userId = req.params.id as string;

    await userService.deleteUser(userId);
    ApiResponse.send(res, HttpCodes.NO_CONTENT, "User deleted successfully.");
  }
}

export default new UserController();

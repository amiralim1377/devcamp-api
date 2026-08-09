import User, { IUser } from "../models/user.model.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { AppError } from "../utils/AppError.js";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";

class UserService {
  async getAllUsers(queryString: any) {
    const features = new ApiFeatures(User.find(), queryString)
      .filter()
      .select()
      .sort()
      .paginate();

    const users = await features.query;
    return users;
  }

  async getUser(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      AppError.throwError(
        "UserService.getUser",
        HttpCodes.NOT_FOUND,
        AppCodes.USER_NOT_FOUND,
        "کاربری با این شناسه یافت نشد",
      );
    }

    return user;
  }

  async createUser(userData: Partial<IUser>) {
    const user = await User.create(userData);
    return user;
  }

  async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      AppError.throwError(
        "UserService.deleteUser",
        HttpCodes.NOT_FOUND,
        AppCodes.USER_NOT_FOUND,
        "کاربری با این شناسه یافت نشد",
      );
    }

    return user;
  }

  async deleteMe(userId: string) {
    const user = await User.findByIdAndUpdate(userId, { active: false });

    if (!user) {
      AppError.throwError(
        "UserService.deleteMe",
        HttpCodes.NOT_FOUND,
        AppCodes.USER_NOT_FOUND,
        "کاربر یافت نشد",
      );
    }

    return null;
  }

  async updateUser(userId: string, updateData: any) {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      AppError.throwError(
        "UserService.updateUser",
        HttpCodes.NOT_FOUND,
        AppCodes.USER_NOT_FOUND,
        "User not found",
      );
    }

    return updatedUser;
  }
}

export default new UserService();

import User, { IUser } from "../models/user.model.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { AppError } from "../utils/AppError.js";

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
    const user = User.findById(userId);
    if (!user) {
      throw new AppError("کاربری با این شناسه یافت نشد", 404);
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
      throw new AppError("کاربری با این شناسه یافت نشد", 404);
    }
    return user;
  }

  async deleteMe(userId: string) {
    const user = await User.findByIdAndUpdate(userId, { active: false });

    if (!user) {
      throw new AppError("کاربر یافت نشد", 404);
    }
    return null;
  }

  async updateUser(userId: string, updateData: any) {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    return updatedUser;
  }
}

export default new UserService();

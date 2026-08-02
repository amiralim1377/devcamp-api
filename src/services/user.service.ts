import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";

class UserService {
  async updateDetails(userId: string, updateData: any) {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    return updatedUser;
  }
  async updatePassword() {}
}

export default new UserService();

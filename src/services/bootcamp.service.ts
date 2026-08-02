import { Bootcamp, IBootcamp } from "../models/bootcamp.model.js";
import { AppError } from "../utils/AppError.js";

class BootcampService {
  async createBootcamp(bootcampData: Partial<IBootcamp>) {
    const newBootcamp = await Bootcamp.create(bootcampData);
    return newBootcamp;
  }

  async getAllBootcamps() {
    const bootcamps = await Bootcamp.find();
    return bootcamps;
  }

  async getBootcamp(bootcampId: string) {
    const bootcamp = await Bootcamp.findById(bootcampId).populate("courses");
    if (!bootcamp) {
      throw new AppError("Bootcamp not found", 404);
    }
    return bootcamp;
  }
  async deleteBootcamp(bootcampId: string, userId: string, userRole: string) {
    const bootcamp = await Bootcamp.findById(bootcampId);
    if (!bootcamp) {
      throw new AppError("Bootcamp not found", 404);
    }

    if (bootcamp.instructor.toString() !== userId && userRole !== "admin") {
      throw new AppError("User not authorized to delete this bootcamp", 403);
    }

    await bootcamp.deleteOne();

    return bootcamp;
  }
  async updateBootcamp(
    bootcampId: string,
    updateData: Partial<IBootcamp>,
    userId: string,
    userRole: string,
  ) {
    let bootcamp = await Bootcamp.findById(bootcampId);

    if (!bootcamp) {
      throw new AppError(`Bootcamp not found with id of ${bootcampId}`, 404);
    }
    if (bootcamp.instructor.toString() !== userId && userRole !== "admin") {
      throw new AppError("User not authorized to update this bootcamp", 403);
    }

    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
      bootcampId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedBootcamp) {
      throw new AppError(`Bootcamp not found with id of ${bootcampId}`, 404);
    }

    return updatedBootcamp;
  }
}

export default new BootcampService();

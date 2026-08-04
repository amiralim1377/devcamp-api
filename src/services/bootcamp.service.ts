import { Bootcamp, IBootcamp } from "../models/bootcamp.model.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { AppError } from "../utils/AppError.js";
import fs from "fs/promises";
import path from "path";

class BootcampService {
  async getAllBootcamps(queryString: any) {
    let features = new ApiFeatures(
      Bootcamp.find().populate([
        { path: "courses" },
        {
          path: "reviews",
          populate: {
            path: "user",
            select: "name",
          },
        },
      ]),
      queryString,
    )
      .filter()
      .select()
      .sort()
      .paginate();

    const bootcamps = await features.query;
    return bootcamps;
  }

  async getBootcamp(bootcampId: string) {
    const bootcamp = await Bootcamp.findById(bootcampId).populate("courses");
    if (!bootcamp) {
      throw new AppError("Bootcamp not found", 404);
    }
    return bootcamp;
  }

  async createBootcamp(bootcampData: Partial<IBootcamp>) {
    const newBootcamp = await Bootcamp.create(bootcampData);
    return newBootcamp;
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

  async uploadBootcampImage(
    bootcampId: string,
    fileName: string,
    userId: string,
    userRole: string,
  ) {
    const bootcamp = await Bootcamp.findById(bootcampId);
    if (!bootcamp) {
      throw new AppError("Bootcamp not found", 404);
    }

    if (bootcamp.instructor.toString() !== userId && userRole !== "admin") {
      throw new AppError("User not authorized to update this bootcamp", 403);
    }

    if (bootcamp.photo && bootcamp.photo !== "no-photo.jpg") {
      const oldImagePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        bootcamp.photo,
      );

      try {
        await fs.unlink(oldImagePath);
        console.log(`Old image (${bootcamp.photo}) deleted successfully.`);
      } catch (error) {
        console.error("Could not delete old image:", error);
      }
    }

    bootcamp.photo = fileName;
    await bootcamp.save();
    return bootcamp;
  }
}

export default new BootcampService();

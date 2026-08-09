import { Bootcamp, IBootcamp } from "../models/bootcamp.model.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { AppError } from "../utils/AppError.js";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";
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
      AppError.throwError(
        "BootcampService.getBootcamp",
        HttpCodes.NOT_FOUND,
        AppCodes.BOOTCAMP_NOT_FOUND,
        "Bootcamp not found",
      );
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
      AppError.throwError(
        "BootcampService.deleteBootcamp",
        HttpCodes.NOT_FOUND,
        AppCodes.BOOTCAMP_NOT_FOUND,
        "Bootcamp not found",
      );
    }

    if (bootcamp.instructor.toString() !== userId && userRole !== "admin") {
      AppError.throwError(
        "BootcampService.deleteBootcamp",
        HttpCodes.FORBIDDEN,
        AppCodes.FORBIDDEN_ACCESS,
        "User not authorized to delete this bootcamp",
      );
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
      AppError.throwError(
        "BootcampService.updateBootcamp",
        HttpCodes.NOT_FOUND,
        AppCodes.BOOTCAMP_NOT_FOUND,
        `Bootcamp not found with id of ${bootcampId}`,
      );
    }

    if (bootcamp.instructor.toString() !== userId && userRole !== "admin") {
      AppError.throwError(
        "BootcampService.updateBootcamp",
        HttpCodes.FORBIDDEN,
        AppCodes.FORBIDDEN_ACCESS,
        "User not authorized to update this bootcamp",
      );
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
      AppError.throwError(
        "BootcampService.updateBootcamp",
        HttpCodes.NOT_FOUND,
        AppCodes.BOOTCAMP_NOT_FOUND,
        `Bootcamp not found with id of ${bootcampId}`,
      );
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
      AppError.throwError(
        "BootcampService.uploadBootcampImage",
        HttpCodes.NOT_FOUND,
        AppCodes.BOOTCAMP_NOT_FOUND,
        "Bootcamp not found",
      );
    }

    if (bootcamp.instructor.toString() !== userId && userRole !== "admin") {
      AppError.throwError(
        "BootcampService.uploadBootcampImage",
        HttpCodes.FORBIDDEN,
        AppCodes.FORBIDDEN_ACCESS,
        "User not authorized to update this bootcamp",
      );
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

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
    const bootcamp = await Bootcamp.findById(bootcampId);
    if (!bootcamp) {
      throw new AppError("Bootcamp not found", 404);
    }
    return bootcamp;
  }
  async deleteBootcamp(bootcampId: string) {
    const bootcamp = await Bootcamp.findByIdAndDelete(bootcampId);
    if (!bootcamp) {
      throw new AppError("Bootcamp not found", 404);
    }

    return bootcamp;
  }
  async updateBootcamp(bootcampId: string, updateData: Partial<IBootcamp>) {
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

import { Bootcamp, IBootcamp } from "../models/bootcamp.model.js";

class BootcampService {
  async createBootcamp(bootcampData: Partial<IBootcamp>) {
    const newBootcamp = await Bootcamp.create(bootcampData);
    return newBootcamp;
  }

  async getAllBootcamps() {
    const bootcamps = await Bootcamp.find();
    return bootcamps;
  }
}

export default new BootcampService();

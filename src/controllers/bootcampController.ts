import { NextFunction, Response, Request } from "express";
import bootcampService from "../services/bootcamp.service.js";

class BootcampController {
  async createBootcamp(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.instructor = req.user?._id;

      const newBootcamp = await bootcampService.createBootcamp(req.body);

      res.status(201).json({
        status: "success",
        data: {
          bootcamp: newBootcamp,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllBootcamps(req: Request, res: Response, next: NextFunction) {
    try {
      const bootcamps = await bootcampService.getAllBootcamps();
      res.status(200).json({
        status: "success",
        results: bootcamps.length,
        data: {
          bootcamps,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BootcampController();

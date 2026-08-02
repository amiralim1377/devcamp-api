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
      const bootcamps = await bootcampService.getAllBootcamps(req.query);
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

  async getSingleBootcamp(req: Request, res: Response, next: NextFunction) {
    try {
      const bootcampId = req.params.id as string;
      const bootcamp = await bootcampService.getBootcamp(bootcampId);

      res.status(200).json({
        status: "success",
        data: {
          bootcamp,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteBootcamp(req: Request, res: Response, next: NextFunction) {
    try {
      const bootcampId = req.params.id as string;
      const userId = req.user!._id.toString();
      const userRole = req.user!.role;

      await bootcampService.deleteBootcamp(bootcampId, userId, userRole);

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateBootcamp(req: Request, res: Response, next: NextFunction) {
    try {
      const bootcampId = req.params.id as string;
      const updatedData = req.body;
      const userId = req.user!._id.toString();
      const userRole = req.user!.role;

      const updatedBootcamp = await bootcampService.updateBootcamp(
        bootcampId,
        updatedData,
        userId,
        userRole,
      );

      res.status(200).json({
        status: "success",
        data: {
          bootcamp: updatedBootcamp,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BootcampController();

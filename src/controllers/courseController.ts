import { NextFunction, Response, Request } from "express";
import courseService from "../services/course.service.js";

class CourseController {
  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await courseService.getAllCourses();

      res.status(200).json({
        status: "success",
        results: courses.length,
        data: {
          courses,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const bootcampId = req.params.bootcampId as string;

      const userId = req.user!._id.toString();
      const userRole = req.user!.role;

      const course = await courseService.createCourse(
        bootcampId,
        req.body,
        userId,
        userRole,
      );

      res.status(201).json({
        status: "success",
        data: {
          course,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CourseController();

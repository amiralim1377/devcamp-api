import { NextFunction, Response, Request } from "express";
import courseService from "../services/course.service.js";

class CourseController {
  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const bootcampId = req.params.bootcampId as string;
      const courses = await courseService.getAllCourses(req.query, bootcampId);

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

  async getSingleCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.id as string;

      const courses = await courseService.getCourse(courseId);

      res.status(200).json({
        status: "success",
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

  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.id as string;
      const userId = req.user!._id.toString();
      const userRole = req.user!.role;

      await courseService.deleteCourse(courseId, userId, userRole);
      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.id as string;
      const userId = req.user!._id.toString();
      const userRole = req.user!.role;

      const course = await courseService.updateCourse(
        courseId,
        req.body,
        userId,
        userRole,
      );
      res.status(200).json({
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

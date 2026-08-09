import { Response, Request } from "express";
import courseService from "../services/course.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HttpCodes } from "../utils/HttpCodes.js";

class CourseController {
  async getAllCourses(req: Request, res: Response) {
    const bootcampId = req.params.bootcampId as string;
    const courses = await courseService.getAllCourses(req.query, bootcampId);

    ApiResponse.send(
      res,
      HttpCodes.OK,
      "Courses retrieved successfully.",
      { courses },
      { results: courses.length },
    );
  }

  async getSingleCourse(req: Request, res: Response) {
    const courseId = req.params.id as string;

    const course = await courseService.getCourse(courseId);

    ApiResponse.send(res, HttpCodes.OK, "Course retrieved successfully.", {
      course,
    });
  }

  async createCourse(req: Request, res: Response) {
    const bootcampId = req.params.bootcampId as string;

    const userId = req.user!._id.toString();
    const userRole = req.user!.role;

    const course = await courseService.createCourse(
      bootcampId,
      req.body,
      userId,
      userRole,
    );

    ApiResponse.send(res, HttpCodes.CREATED, "Course created successfully.", {
      course,
    });
  }

  async deleteCourse(req: Request, res: Response) {
    const courseId = req.params.id as string;
    const userId = req.user!._id.toString();
    const userRole = req.user!.role;

    await courseService.deleteCourse(courseId, userId, userRole);

    ApiResponse.send(res, HttpCodes.NO_CONTENT, "Course deleted successfully.");
  }

  async updateCourse(req: Request, res: Response) {
    const courseId = req.params.id as string;
    const userId = req.user!._id.toString();
    const userRole = req.user!.role;

    const course = await courseService.updateCourse(
      courseId,
      req.body,
      userId,
      userRole,
    );
    ApiResponse.send(res, HttpCodes.OK, "Course updated successfully.", {
      course,
    });
  }
}

export default new CourseController();

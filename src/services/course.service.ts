import { Bootcamp } from "../models/bootcamp.model.js";
import { Course, ICourse } from "../models/course.model.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { AppError } from "../utils/AppError.js";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";

class CourseService {
  async getAllCourses(queryString: any, bootcampId?: string) {
    let baseQuery = bootcampId
      ? Course.find({ bootcamp: bootcampId })
      : Course.find();

    let features = new ApiFeatures(baseQuery, queryString)
      .filter()
      .sort()
      .select()
      .paginate();

    let query = features.query.populate({
      path: "bootcamp",
      select: "title description",
    });

    const courses = await query;

    return courses;
  }

  async getCourse(id: string) {
    const course = await Course.findById(id).populate({
      path: "bootcamp",
      select: "title description",
    });

    if (!course) {
      AppError.throwError(
        "CourseService.getCourse",
        HttpCodes.NOT_FOUND,
        AppCodes.COURSE_NOT_FOUND,
        `No course found with id of ${id}`,
      );
    }

    return course;
  }

  async createCourse(
    bootcampId: string,
    courseData: Partial<ICourse>,
    userId: string,
    userRole: string,
  ) {
    const bootcamp = await Bootcamp.findById(bootcampId);

    if (!bootcamp) {
      AppError.throwError(
        "CourseService.createCourse",
        HttpCodes.NOT_FOUND,
        AppCodes.BOOTCAMP_NOT_FOUND,
        `No bootcamp found with id of ${bootcampId}`,
      );
    }

    if (bootcamp.instructor.toString() !== userId && userRole !== "admin") {
      AppError.throwError(
        "CourseService.createCourse",
        HttpCodes.FORBIDDEN,
        AppCodes.FORBIDDEN_ACCESS,
        "User not authorized to add a course to this bootcamp",
      );
    }

    courseData.bootcamp = bootcampId as any;
    courseData.instructor = userId as any;
    const course = await Course.create(courseData);
    return course;
  }

  async deleteCourse(id: string, userId: string, userRole: string) {
    const course = await Course.findById(id);

    if (!course) {
      AppError.throwError(
        "CourseService.deleteCourse",
        HttpCodes.NOT_FOUND,
        AppCodes.COURSE_NOT_FOUND,
        `No course found with id of ${id}`,
      );
    }

    if (course.instructor.toString() !== userId && userRole !== "admin") {
      AppError.throwError(
        "CourseService.deleteCourse",
        HttpCodes.FORBIDDEN,
        AppCodes.FORBIDDEN_ACCESS,
        `User not authorized to delete course ${course._id}`,
      );
    }

    await course.deleteOne();
    return;
  }

  async updateCourse(
    id: string,
    updateData: Partial<ICourse>,
    userId: string,
    userRole: string,
  ) {
    let course = await Course.findById(id);

    if (!course) {
      AppError.throwError(
        "CourseService.updateCourse",
        HttpCodes.NOT_FOUND,
        AppCodes.COURSE_NOT_FOUND,
        `No course found with id of ${id}`,
      );
    }

    if (course.instructor.toString() !== userId && userRole !== "admin") {
      AppError.throwError(
        "CourseService.updateCourse",
        HttpCodes.FORBIDDEN,
        AppCodes.FORBIDDEN_ACCESS,
        `User not authorized to update course ${course._id}`,
      );
    }

    course = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return course;
  }
}

export default new CourseService();

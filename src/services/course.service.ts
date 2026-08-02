import { Bootcamp } from "../models/bootcamp.model.js";
import { Course, ICourse } from "../models/course.model.js";
import { AppError } from "../utils/AppError.js";

class CourseService {
  async getAllCourses() {
    const courses = await Course.find();
    return courses;
  }

  async createCourse(
    bootcampId: string,
    courseData: Partial<ICourse>,
    userId: string,
    userRole: string,
  ) {
    const bootcamp = await Bootcamp.findById(bootcampId);

    if (!bootcamp) {
      throw new AppError(`No bootcamp found with id of ${bootcampId}`, 404);
    }

    if (bootcamp.instructor.toString() !== userId && userRole !== "admin") {
      throw new AppError(
        `User not authorized to add a course to this bootcamp`,
        403,
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
      throw new AppError(`No course found with id of ${id}`, 404);
    }

    if (course.instructor.toString() !== userId && userRole !== "admin") {
      throw new AppError(
        `User not authorized to delete course ${course._id}`,
        403,
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
      throw new AppError(`No course found with id of ${id}`, 404);
    }

    if (course.instructor.toString() !== userId && userRole !== "admin") {
      throw new AppError(
        `User not authorized to update course ${course._id}`,
        403,
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

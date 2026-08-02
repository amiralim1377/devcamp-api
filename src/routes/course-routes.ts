import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createCourseSchema } from "../schemas/course.schema.js";
import courseController from "../controllers/courseController.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(
    protect,
    restrictTo("instructor", "admin"),
    validateRequest(createCourseSchema),
    courseController.createCourse,
  );

router
  .route("/:id")
  .get(courseController.getSingleCourse)
  .patch(
    protect,
    restrictTo("instructor", "admin"),
    courseController.updateCourse,
  )
  .delete(
    protect,
    restrictTo("instructor", "admin"),
    courseController.deleteCourse,
  );

export default router;

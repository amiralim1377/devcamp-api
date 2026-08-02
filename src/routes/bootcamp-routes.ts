import express from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import bootcampController from "../controllers/bootcampController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createBootcampSchema } from "../schemas/bootcamp.schema.js";
import courseRouter from "./course-routes.js";
import { upload } from "../middlewares/upload.middleware.js";
import { resizeBootcampPhoto } from "../middlewares/image.middleware.js";

const router = express.Router();

// Nested Routes
router.use("/:bootcampId/courses", courseRouter);

router.get("/", bootcampController.getAllBootcamps);
router.get("/:id", bootcampController.getSingleBootcamp);

router.use(protect, restrictTo("instructor", "admin"));

router.post(
  "/",
  validateRequest(createBootcampSchema),
  bootcampController.createBootcamp,
);
router
  .route("/:id")
  .patch(bootcampController.updateBootcamp)
  .delete(bootcampController.deleteBootcamp);

router.put(
  "/:id/photo",
  upload.single("photo"),
  resizeBootcampPhoto,
  bootcampController.uploadBootcampPhoto,
);

export default router;

import express from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import bootcampController from "../controllers/bootcampController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createBootcampSchema } from "../schemas/bootcamp.schema.js";

const router = express.Router();

// Protect all routes after this middleware

router.get("/", bootcampController.getAllBootcamps);

router.use(protect, restrictTo("instructor", "admin"));
router.post(
  "/",
  validateRequest(createBootcampSchema),
  bootcampController.createBootcamp,
);

export default router;

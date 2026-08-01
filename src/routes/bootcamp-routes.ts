import express from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import bootcampController from "../controllers/bootcampController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { createBootcampSchema } from "../schemas/bootcamp.schema.js";

const router = express.Router();

router.get("/", bootcampController.getAllBootcamps);
router.get("/:id", bootcampController.getSingleBootcamp);

router.use(protect, restrictTo("instructor", "admin"));
router.post(
  "/",
  validateRequest(createBootcampSchema),
  bootcampController.createBootcamp,
);
router.delete("/:id", bootcampController.deleteBootcamp);
router.patch("/:id", bootcampController.updateBootcamp);

export default router;

import express from "express";
import reviewController from "../controllers/reviewController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../schemas/review.schema.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getReviews)
  .post(
    protect,
    restrictTo("student", "admin"),
    validateRequest(createReviewSchema),
    reviewController.createReview,
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .put(
    protect,
    restrictTo("student", "admin"),
    validateRequest(updateReviewSchema),
    reviewController.updateReview,
  )
  .delete(
    protect,
    restrictTo("student", "admin"),
    reviewController.deleteReview,
  );

export default router;

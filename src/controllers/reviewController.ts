import { NextFunction, Response, Request } from "express";
import reviewService from "../services/review.service.js";

class ReviewController {
  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const bootcampId = req.params.bootcampId as string;
      const reviews = await reviewService.getReviews(req.query, bootcampId);

      res.status(200).json({
        status: "success",
        results: reviews.length,
        data: {
          reviews,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = req.params.id as string;
      const review = await reviewService.getReview(reviewId);
      res.status(200).json({
        status: "success",
        data: {
          review,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const bootcampId = req.params.bootcampId as string;
      const userId = req.user!._id.toString();

      const review = await reviewService.createReview(
        bootcampId,
        userId,
        req.body,
      );
      res.status(201).json({
        status: "success",
        data: {
          review,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = req.params.id as string;
      const userId = req.user!._id.toString();
      const userRole = req.user!.role;

      const review = await reviewService.updateReview(
        reviewId,
        userId,
        userRole,
        req.body,
      );

      res.status(200).json({
        status: "success",
        data: {
          review,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = req.params.id as string;
      const userId = req.user!._id.toString();
      const userRole = req.user!.role;

      await reviewService.deleteReview(reviewId, userId, userRole);

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewController();

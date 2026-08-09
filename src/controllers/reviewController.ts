import { Response, Request } from "express";
import reviewService from "../services/review.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HttpCodes } from "../utils/HttpCodes.js";

class ReviewController {
  async getReviews(req: Request, res: Response) {
    const bootcampId = req.params.bootcampId as string;
    const reviews = await reviewService.getReviews(req.query, bootcampId);

    ApiResponse.send(
      res,
      HttpCodes.OK,
      "Reviews retrieved successfully.",
      { reviews },
      { results: reviews.length },
    );
  }

  async getReview(req: Request, res: Response) {
    const reviewId = req.params.id as string;
    const review = await reviewService.getReview(reviewId);
    ApiResponse.send(res, HttpCodes.OK, "Review retrieved successfully.", {
      review,
    });
  }

  async createReview(req: Request, res: Response) {
    const bootcampId = req.params.bootcampId as string;
    const userId = req.user!._id.toString();

    const review = await reviewService.createReview(
      bootcampId,
      userId,
      req.body,
    );
    ApiResponse.send(res, HttpCodes.CREATED, "Review created successfully.", {
      review,
    });
  }

  async updateReview(req: Request, res: Response) {
    const reviewId = req.params.id as string;
    const userId = req.user!._id.toString();
    const userRole = req.user!.role;

    const review = await reviewService.updateReview(
      reviewId,
      userId,
      userRole,
      req.body,
    );

    ApiResponse.send(res, HttpCodes.OK, "Review updated successfully.", {
      review,
    });
  }

  async deleteReview(req: Request, res: Response) {
    const reviewId = req.params.id as string;
    const userId = req.user!._id.toString();
    const userRole = req.user!.role;

    await reviewService.deleteReview(reviewId, userId, userRole);
    ApiResponse.send(res, HttpCodes.NO_CONTENT, "Review deleted successfully.");
  }
}

export default new ReviewController();

import { Bootcamp } from "../models/bootcamp.model.js";
import { IReview, Review } from "../models/review.model.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { AppError } from "../utils/AppError.js";

class ReviewService {
  async getReviews(queryString: any, bootcampId?: string) {
    let filter = {};
    if (bootcampId) {
      filter = { bootcamp: bootcampId };
    }
    const query = Review.find(filter).populate({
      path: "user",
      select: "name",
    });
    const features = new ApiFeatures(query, queryString)
      .filter()
      .sort()
      .select()
      .paginate();

    return await features.query;
  }
  async getReview(id: string) {
    const review = await Review.findById(id).populate({
      path: "bootcamp",
      select: "title description",
    });
    if (!review) {
      throw new AppError(`نظری با شناسه ${id} یافت نشد`, 404);
    }

    return review;
  }

  async createReview(
    bootcampId: string,
    userId: string,
    reviewData: Partial<IReview>,
  ) {
    const bootcamp = await Bootcamp.findById(bootcampId);
    if (!bootcamp) {
      throw new AppError(`بوت‌کمپی با شناسه ${bootcampId} یافت نشد`, 404);
    }

    reviewData.bootcamp = bootcampId as any;
    reviewData.user = userId as any;

    const review = await Review.create(reviewData);

    return review;
  }

  async updateReview(
    id: string,
    userId: string,
    userRole: string,
    updateData: Partial<IReview>,
  ) {
    const review = await Review.findById(id);
    if (!review) {
      throw new AppError(`نظری با شناسه ${id} یافت نشد`, 404);
    }

    if (review.user.toString() !== userId && userRole! == "admin") {
      throw new AppError("شما دسترسی لازم برای ویرایش این نظر را ندارید", 403);
    }
    if (updateData.title) review.title = updateData.title;
    if (updateData.text) review.text = updateData.text;
    if (updateData.rating) review.rating = updateData.rating;

    await review.save();
    return review;
  }

  async deleteReview(id: string, userId: string, userRole: string) {
    const review = await Review.findById(id);

    if (!review) {
      throw new AppError(`نظری با شناسه ${id} یافت نشد`, 404);
    }

    if (review.user.toString() !== userId && userRole !== "admin") {
      throw new AppError("شما دسترسی لازم برای حذف این نظر را ندارید", 403);
    }

    await review.deleteOne();
  }
}

export default new ReviewService();

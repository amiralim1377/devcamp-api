import mongoose, { Model, Schema, Types } from "mongoose";
import { Bootcamp } from "./bootcamp.model.js";

export interface IReview {
  title: string;
  text: string;
  rating: number;
  bootcamp: Types.ObjectId;
  user: Types.ObjectId;
}

interface IReviewModel extends Model<IReview> {
  calcAverageRating(bootcampId: Types.ObjectId): Promise<void>;
}

const reviewSchema = new Schema<IReview, IReviewModel>(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "لطفاً یک عنوان برای نظر خود بنویسید"],
      maxlength: 100,
    },
    text: {
      type: String,
      required: [true, "لطفاً متن نظر خود را وارد کنید"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "لطفاً امتیازی بین ۱ تا ۵ وارد کنید"],
    },
    bootcamp: {
      type: Schema.Types.ObjectId,
      ref: "Bootcamp",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function (
  bootcampId: Types.ObjectId,
) {
  const stats = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await Bootcamp.findByIdAndUpdate(bootcampId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
      });
    } else {
      await Bootcamp.findByIdAndUpdate(bootcampId, {
        averageRating: 1,
      });
    }
  } catch (error) {
    console.error("Error calculating average rating:", error);
  }
};

reviewSchema.post("save", function () {
  (this.constructor as any).calcAverageRating(this.bootcamp);
});

reviewSchema.post("deleteOne", { document: true, query: false }, function () {
  (this.constructor as any).calcAverageRating(this.bootcamp);
});

export const Review = mongoose.model<IReview, IReviewModel>(
  "Review",
  reviewSchema,
);

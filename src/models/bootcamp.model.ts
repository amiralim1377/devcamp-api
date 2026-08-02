import { Schema, model, Types, Document } from "mongoose";
import slugify from "slugify";

export interface IBootcamp extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  instructor: Types.ObjectId;
  averageRating: number;
  startDate: Date;
}

const bootcampSchema = new Schema<IBootcamp>(
  {
    title: {
      type: String,
      required: [true, "Bootcamp title is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Title must be less than 50 characters"],
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Bootcamp description is required"],
      minlength: [50, "Description must be at least 50 characters"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Bootcamp price is required"],
    },

    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Bootcamp must have an instructor"],
    },

    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be less than 5"],
      default: 1,
    },

    startDate: {
      type: Date,
      required: [true, "Bootcamp start date is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// virtual fields
bootcampSchema.virtual("courses", {
  // Q: Which model/collection should I get the data from?
  // A: From the 'Course' model.
  ref: "Course",
  // Q: What is the primary key in the current model (Bootcamp) to match against?
  // A: The '_id' of the current bootcamp.
  localField: "_id",
  // Q: Which field in the target model (Course) contains the reference to my ID?
  // A: The 'bootcamp' field in the Course model.
  foreignField: "bootcamp",
  // Q: Should I return just one single document or an array of all matching documents?
  // A: Find all of them (return an array), so justOne is 'false'.
  justOne: false,
});

bootcampSchema.pre("save", function (this: IBootcamp) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true });
  }
});
export const Bootcamp = model<IBootcamp>("Bootcamp", bootcampSchema);

import z from "zod";

export const createReviewSchema = z.object({
  title: z
    .string({ message: "Please provide a title for the review" })
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot be more than 100 characters"),

  text: z
    .string({ message: "Please provide some text for the review" })
    .min(1, "Review text cannot be empty"),

  rating: z
    .number({ message: "Please add a rating" })
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),
});

export const updateReviewSchema = z.object({
  title: z
    .string()
    .max(100, "Title cannot be more than 100 characters")
    .optional(),
  text: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});

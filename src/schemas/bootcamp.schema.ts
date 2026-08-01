import z from "zod";

export const createBootcampSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(50, "Title must be less than 50 characters"),
  description: z
    .string()
    .trim()
    .min(50, "Description must be at least 50 characters"),
  price: z.number().positive("Price must be greater than 0"),
  startDate: z.coerce.date(),
});

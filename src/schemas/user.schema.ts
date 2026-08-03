import z from "zod";

export const updateDetailsSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    email: z.email("Invalid email format").optional(),
  })
  .strict();

export const createUserSchema = z
  .object({
    name: z
      .string({ message: "Please tell us your name!" })
      .min(3, "Name must be at least 3 characters"),

    email: z
      .string({ message: "Please provide your email!" })
      .email("Invalid email format"),

    password: z
      .string({ message: "Please provide a password!" })
      .min(8, "Password must be at least 8 characters"),

    passwordConfirm: z.string({ message: "Please confirm your password" }),

    role: z.enum(["student", "instructor", "admin"]).optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords are not the same!",
    path: ["passwordConfirm"],
  });

export const updateUserSchema = z
  .object({
    name: z.string().min(3).optional(),
    email: z.email("Invalid email format").optional(),
    role: z.enum(["student", "instructor", "admin"]).optional(),
    active: z.boolean().optional(),
  })
  .strict();

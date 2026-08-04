import z from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
  })
  .strict();

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Please provide your email" })
    .email("Invalid email format"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ message: "Please provide a new password" })
      .min(8, "Password must be at least 8 characters"),
    passwordConfirm: z.string({ message: "Please confirm your new password" }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords are not the same!",
    path: ["passwordConfirm"],
  });

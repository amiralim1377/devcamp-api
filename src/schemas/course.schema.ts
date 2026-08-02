import z from "zod";

export const createCourseSchema = z.object({
  title: z
    .string({ message: "Please add a course title" })
    .min(1, "Please add a course title")
    .trim(),

  description: z
    .string({ message: "Please add a description" })
    .min(1, "Please add a description"),

  weeks: z
    .string({ message: "Please add number of weeks" })
    .min(1, "Please add number of weeks"),

  tuition: z.number({ message: "Please add a tuition cost" }),

  minimumSkill: z.enum(["beginner", "intermediate", "advanced"], {
    message: "Please add a minimum skill",
  }),
});

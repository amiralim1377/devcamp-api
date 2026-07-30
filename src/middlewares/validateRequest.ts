import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest = <T>(schema: z.ZodType<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data;

    next();
  };
};

export { validateRequest };

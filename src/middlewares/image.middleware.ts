import { Response, Request, NextFunction } from "express";
import sharp from "sharp";
import { AppError } from "../utils/AppError.js";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";

export const resizeBootcampPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) return next();

  const bootcampId = req.params.id;
  req.file.filename = `bootcamp-${bootcampId}-${Date.now()}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .toFile(`public/uploads/${req.file.filename}`);

    next();
  } catch (error) {
    AppError.throwError(
      "resizeBootcampPhoto Middleware",
      HttpCodes.INTERNAL_SERVER_ERROR,
      AppCodes.INTERNAL_SERVER_ERROR,
      "Error processing image",
    );
  }
};

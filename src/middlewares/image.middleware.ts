import { Response, Request, NextFunction } from "express";
import sharp from "sharp";
import { AppError } from "../utils/AppError.js";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";

const resizeBootcampPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) return next();

    const bootcampId = req.params.id;

    req.file.filename = `bootcamp-${bootcampId}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .toFile(`public/uploads/${req.file.filename}`);

    next();
  } catch (error) {
    next(
      AppError.create(
        HttpCodes.INTERNAL_SERVER_ERROR,
        AppCodes.INTERNAL_SERVER_ERROR,
        "Error processing image",
      ),
    );
  }
};

export { resizeBootcampPhoto };

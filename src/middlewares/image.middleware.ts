import { Response, Request, NextFunction } from "express";
import sharp from "sharp";
import { AppError } from "../utils/AppError.js";

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
    next(new AppError("Error processing image", 500));
  }
};

export { resizeBootcampPhoto };

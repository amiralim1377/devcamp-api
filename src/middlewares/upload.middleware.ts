import multer from "multer";
import { Request } from "express";
import { AppError } from "../utils/AppError.js";

const multerSorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("Not an image! Please upload only images.", 400) as any,
      false,
    );
  }
};

export const upload = multer({
  storage: multerSorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

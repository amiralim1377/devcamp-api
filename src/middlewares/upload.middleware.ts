import multer from "multer";
import { Request } from "express";
import { AppError } from "../utils/AppError.js";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";

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
      AppError.create(
        HttpCodes.BAD_REQUEST,
        AppCodes.INVALID_INPUT,
        "Not an image! Please upload only images.",
      ) as any,
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

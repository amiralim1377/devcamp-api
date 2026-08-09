import { Response, Request } from "express";
import bootcampService from "../services/bootcamp.service.js";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { HttpCodes } from "../utils/HttpCodes.js";
import { AppCodes } from "../utils/AppCodes.js";

class BootcampController {
  async getAllBootcamps(req: Request, res: Response) {
    const bootcamps = await bootcampService.getAllBootcamps(req.query);

    ApiResponse.send(
      res,
      HttpCodes.OK,
      "Bootcamps retrieved successfully.",
      { bootcamps },
      { results: bootcamps.length },
    );
  }

  async getSingleBootcamp(req: Request, res: Response) {
    const bootcampId = req.params.id as string;
    const bootcamp = await bootcampService.getBootcamp(bootcampId);

    ApiResponse.send(res, HttpCodes.OK, "Bootcamp retrieved successfully", {
      bootcamp,
    });
  }

  async createBootcamp(req: Request, res: Response) {
    req.body.instructor = req.user?._id;

    const newBootcamp = await bootcampService.createBootcamp(req.body);

    ApiResponse.send(res, HttpCodes.CREATED, "Bootcamp created successfully", {
      bootcamp: newBootcamp,
    });
  }

  async deleteBootcamp(req: Request, res: Response) {
    const bootcampId = req.params.id as string;
    const userId = req.user!._id.toString();
    const userRole = req.user!.role;

    await bootcampService.deleteBootcamp(bootcampId, userId, userRole);

    ApiResponse.send(
      res,
      HttpCodes.NO_CONTENT,
      "Bootcamp deleted successfully",
    );
  }

  async updateBootcamp(req: Request, res: Response) {
    const bootcampId = req.params.id as string;
    const updatedData = req.body;
    const userId = req.user!._id.toString();
    const userRole = req.user!.role;

    const updatedBootcamp = await bootcampService.updateBootcamp(
      bootcampId,
      updatedData,
      userId,
      userRole,
    );

    ApiResponse.send(res, HttpCodes.OK, "Bootcamp updated successfully", {
      bootcamp: updatedBootcamp,
    });
  }

  async uploadBootcampPhoto(req: Request, res: Response) {
    if (!req.file) {
      AppError.throwError(
        "BootcampController.uploadBootcampPhoto",
        HttpCodes.BAD_REQUEST,
        AppCodes.INVALID_INPUT,
        "Please upload a file",
      );
    }

    const bootcampId = req.params.id as string;
    const filename = req.file.filename;
    const userId = req.user!._id.toString();
    const userRole = req.user!.role;

    const updatedBootcamp = await bootcampService.uploadBootcampImage(
      bootcampId,
      filename,
      userId,
      userRole,
    );

    ApiResponse.send(
      res,
      HttpCodes.OK,
      "Bootcamp photo uploaded successfully",
      {
        photo: filename,
        bootcamp: updatedBootcamp,
      },
    );
  }
}

export default new BootcampController();

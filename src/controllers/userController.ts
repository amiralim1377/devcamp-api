import { NextFunction, Response, Request } from "express";

class UserController {
  async getMe(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  }
}

export default new UserController();

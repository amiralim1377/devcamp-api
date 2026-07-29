import { Request, Response, NextFunction } from "express";

class AuthController {
  signup(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      status: "success",
      message: "user created",
    });
  }
}

export default new AuthController();

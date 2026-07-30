import express from "express";
import authController from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { signupSchema } from "../schemas/auth.schema.js";
const router = express.Router();

router.post("/signup", validateRequest(signupSchema), authController.signup);

export default router;

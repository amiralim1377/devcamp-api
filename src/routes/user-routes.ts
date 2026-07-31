import express from "express";
import authController from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginSchema, signupSchema } from "../schemas/auth.schema.js";
import userController from "../controllers/userController.js";
const router = express.Router();

router.post("/signup", validateRequest(signupSchema), authController.signup);
router.post("/login", validateRequest(loginSchema), authController.login);

// Protect all routes after this middleware
router.use(authController.protect);

router.get("/me", userController.getMe);

export default router;

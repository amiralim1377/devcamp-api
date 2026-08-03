import authController from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  loginSchema,
  signupSchema,
  updatePasswordSchema,
} from "../schemas/auth.schema.js";
import express from "express";

const router = express.Router();

router.post("/signup", validateRequest(signupSchema), authController.signup);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

router.put(
  "/updatepassword",
  validateRequest(updatePasswordSchema),
  authController.updatePassword,
);

export default router;

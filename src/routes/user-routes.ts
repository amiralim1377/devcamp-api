import express from "express";
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.get(
  "/me",
  authController.restrictTo("instructor"),
  userController.getMe,
);

export default router;

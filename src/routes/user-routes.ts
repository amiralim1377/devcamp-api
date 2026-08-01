import express from "express";
import userController from "../controllers/userController.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get("/me", restrictTo("instructor"), userController.getMe);

export default router;

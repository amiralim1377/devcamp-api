import express from "express";
import userController from "../controllers/userController.js";
import { protect } from "../middlewares/auth.middleware.js";
import { updateDetailsSchema } from "../schemas/user.schema.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get("/me", userController.getMe);
router.put(
  "/updatedetails",
  validateRequest(updateDetailsSchema),
  userController.updateDetails,
);

export default router;

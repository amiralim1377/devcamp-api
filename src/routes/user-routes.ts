import express from "express";
import userController from "../controllers/userController.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
import {
  createUserSchema,
  updateDetailsSchema,
  updateUserSchema,
} from "../schemas/user.schema.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.route("/me").get(userController.getMe).delete(userController.deleteMe);

router.put(
  "/updatedetails",
  validateRequest(updateDetailsSchema),
  userController.updateDetails,
);

router.use(restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(validateRequest(createUserSchema), userController.createUser);

router
  .route("/:id")
  .get(userController.getSingleUser)
  .put(validateRequest(updateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

export default router;

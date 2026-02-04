import express from "express";
import { usersController } from "./user.controller";
import { auth, userRoles } from "../../middleware/auth";

const router = express.Router();

router.get("/:id", auth(userRoles.ADMIN, userRoles.STUDENT, userRoles.TUTOR), usersController.getUserById);
router.get("/me", auth(), usersController.getCurrentUser);
router.get("/", auth(userRoles.ADMIN), usersController.getAllUsers);
router.patch("/:id/status", auth(userRoles.ADMIN), usersController.updateUserStatus);
router.patch("/:id", auth(userRoles.STUDENT, userRoles.TUTOR), usersController.updateUserProfile);

export const usersRouter = router;

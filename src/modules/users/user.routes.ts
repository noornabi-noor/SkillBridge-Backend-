import express from "express";
import { usersController } from "./user.controller";
import { auth, userRoles } from "../../middleware/auth";

const router = express.Router();

router.get("/", usersController.getAllUsers);
router.get("/:id", auth(userRoles.ADMIN), usersController.getUserById);
router.get("/me", auth(), usersController.getCurrentUser);
router.patch("/:id/status", auth(userRoles.ADMIN), usersController.updateUserStatus);

export const usersRouter = router;

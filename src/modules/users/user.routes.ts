import express from "express";
import { usersController } from "./user.controller";

const router = express.Router();

// Get all users
router.get("/", usersController.getAllUsers);

// Get user by ID
router.get("/:id", usersController.getUserById);

// Get current logged-in user
router.get("/me", usersController.getCurrentUser);

// Update user status
router.patch("/:id/status", usersController.updateUserStatus);

export const usersRouter = router;

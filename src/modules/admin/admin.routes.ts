import express from "express";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get("/users", adminController.getAllUsers);
router.patch("/users/:id", adminController.updateUser);

router.get("/tutor", adminController.getAllTutor);
router.get("/bookings", adminController.getAllBookings);

router.post("/categories", adminController.createCategory);
router.patch("/categories/:id", adminController.updateCategory);

export const adminRouter = router;

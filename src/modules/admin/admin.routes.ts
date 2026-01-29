import express from "express";
import { adminController } from "./admin.controller";
import { auth, userRoles } from "../../middleware/auth";

const router = express.Router();

router.get("/users", auth(userRoles.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(userRoles.ADMIN), adminController.updateUser);

router.get("/tutor", auth(userRoles.ADMIN), adminController.getAllTutor);
router.get("/bookings", auth(userRoles.ADMIN), adminController.getAllBookings);

router.post("/categories", auth(userRoles.ADMIN), adminController.createCategory);
router.patch("/categories/:id", auth(userRoles.ADMIN), adminController.updateCategory);

export const adminRouter = router;

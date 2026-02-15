import express from "express";
import { auth, userRoles } from "../../middleware/auth";
import { tutorController } from "./tutor.controller";

const router = express.Router();

router.get("/top-tutor", tutorController.getTopRatedTutor);
router.get("/by-user/:userId", tutorController.getTutorByUserId);
router.get("/dashboard/:id", auth(userRoles.TUTOR), tutorController.getTutorDashboardStats);
router.get("/", tutorController.getAllTutors);
router.get("/:id", tutorController.getSingleTutor);
router.post("/", auth(), tutorController.createTutorProfile);
router.patch("/", auth(userRoles.TUTOR), tutorController.updateTutorProfile);
router.delete("/:id", auth(userRoles.TUTOR, userRoles.ADMIN), tutorController.deleteTutorProfile);

export const tutorRouter = router;
import express from "express";
import { auth, userRoles } from "../../middleware/auth";
import { tutorController } from "./tutor.controller";

const router = express.Router();

router.get("/", tutorController.getAllTutors);
router.get("/:id", tutorController.getSingleUser);
router.post("/", auth(userRoles.TUTOR), tutorController.createTutorProfile);
router.patch("/:id", auth(userRoles.TUTOR, userRoles.ADMIN), tutorController.updateTutorProfile);
router.delete("/:id", auth(userRoles.TUTOR, userRoles.ADMIN), tutorController.deleteTutorProfile);

export const tutorRouter = router;
import express from "express";
import { auth, userRoles } from "../../middleware/auth";
import { tutorController } from "./tutor.controller";

const router = express.Router();

router.get("/", tutorController.getAllTutors);
router.get("/:id", tutorController.getSingleUser);
router.post("/", auth(userRoles.TUTOR), tutorController.createTutorProfile);
router.patch("/:id", tutorController.updateTutorProfile);
router.delete("/:id", tutorController.deleteTutorProfile);

export const tutorRouter = router;
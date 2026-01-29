import express from "express";
import { tutorCategoryController } from "./tutorCategory.controller";
import { auth, userRoles } from "../../middleware/auth";

const router = express.Router();

router.get("/", tutorCategoryController.getTutorCategories);
router.post("/", auth(userRoles.TUTOR), tutorCategoryController.createTutorCategory);
router.delete("/:id", auth(userRoles.TUTOR), tutorCategoryController.deleteTutorCategory);

export const tutorCategoryRouter = router;

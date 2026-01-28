import express from "express";
import { tutorCategoryController } from "./tutorCategory.controller";

const router = express.Router();

router.post("/", tutorCategoryController.createTutorCategory);
router.get("/", tutorCategoryController.getTutorCategories);
router.delete("/:id", tutorCategoryController.deleteTutorCategory);

export const tutorCategoryRouter = router;

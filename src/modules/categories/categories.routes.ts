import express from "express"
import { categoryController } from "./categories.controller";

const router = express.Router();

router.get("/", categoryController.getAllCategory);
router.get("/:id", categoryController.getSingleCategory);
router.post("/", categoryController.createCategories);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export const categoryRouter = router;
import express from "express"
import { categoryController } from "./categories.controller";
import { auth, userRoles } from "../../middleware/auth";

const router = express.Router();

router.get("/", categoryController.getAllCategory);
router.get("/:id", categoryController.getSingleCategory);
router.post("/", auth(userRoles.ADMIN), categoryController.createCategories);
router.patch("/:id", auth(userRoles.ADMIN), categoryController.updateCategory);
router.delete("/:id", auth(userRoles.ADMIN), categoryController.deleteCategory);

export const categoryRouter = router;
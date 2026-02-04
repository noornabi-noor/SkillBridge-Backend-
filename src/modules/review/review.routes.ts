import express from "express";
import { reviewController } from "./review.controller";
import { auth, userRoles } from "../../middleware/auth";

const router = express.Router();

router.get("/admin", auth(userRoles.ADMIN), reviewController.getReviews);
router.get("/tutor/:id", auth(userRoles.TUTOR), reviewController.getReviewsByTutor);
router.get("/", reviewController.getReviews)
router.post("/", auth(userRoles.STUDENT), reviewController.createReview)
router.patch("/:id", auth(userRoles.STUDENT), reviewController.updateReview);
router.delete("/admin/:id", auth(userRoles.ADMIN), reviewController.deleteReview);
router.delete("/:id", auth(userRoles.STUDENT), reviewController.deleteReview);

export const reviewRouter = router;
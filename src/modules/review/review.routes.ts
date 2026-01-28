import express from "express";
import { reviewController } from "./review.controller";

const router = express.Router();

router.get("/", reviewController.getReviews)
router.post("/", reviewController.createReview)
router.patch("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

export const reviewRouter = router;
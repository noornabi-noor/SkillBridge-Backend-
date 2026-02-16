import { Request, Response, NextFunction } from "express";
import { reviewServices } from "./review.services";

const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reviewServices.createReview(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tutorId, studentId } = req.query;
    const reviews = await reviewServices.getReviews(
      tutorId as string | undefined,
      studentId as string | undefined
    );

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedReview = await reviewServices.updateReview(id as string, req.body);

    res.status(200).json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await reviewServices.deleteReview(id as string);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getReviewsByTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const reviews = await reviewServices.getReviewsByTutor(id as string);

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const reviewController = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getReviewsByTutor,
};

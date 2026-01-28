import { Request, Response } from "express";
import { reviewServices } from "./review.services";

const createReview = async (req: Request, res: Response) => {
  try {
    const result = await reviewServices.createReview(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

const getReviews = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedReview = await reviewServices.updateReview(id as string, req.body);

    res.status(200).json({
      success: true,
      data: updatedReview,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await reviewServices.deleteReview(id as string);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const reviewController = {
  createReview,
  getReviews,
  updateReview,
  deleteReview
};

import { Request, Response, NextFunction } from "express";
import { tutorCategoryServices } from "./tutorCategory.services";

const createTutorCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await tutorCategoryServices.addTutorToCategory(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getTutorCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tutorId, categoryId } = req.query;

    const result = await tutorCategoryServices.getTutorCategories(
      tutorId as string | undefined,
      categoryId as string | undefined
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTutorCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await tutorCategoryServices.removeTutorFromCategory(
      id as string
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const tutorCategoryController = {
  createTutorCategory,
  getTutorCategories,
  deleteTutorCategory,
};
import { Request, Response, NextFunction } from "express";
import { categoryServices } from "./categories.services";

const createCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryServices.createCategories(req.body);
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryServices.getAllCategory();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await categoryServices.getSingleCategory(id as string);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, tutorIds } = req.body;

    const result = await categoryServices.updateCategory(id as string, { name, tutorIds });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await categoryServices.deleteCategory(id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const categoryController = {
  createCategories,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};

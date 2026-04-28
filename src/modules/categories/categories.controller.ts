import { Request, Response, NextFunction } from "express";
import { categoryServices } from "./categories.services";
import { createCategorySchema, updateCategorySchema } from "./categories.validation";

const createCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createCategorySchema.parse(req.body);
    const result = await categoryServices.createCategories(data);
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
    const data = updateCategorySchema.parse(req.body);
    const result = await categoryServices.updateCategory(id as string, data);
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

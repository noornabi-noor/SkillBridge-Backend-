import { Request, Response } from "express";
import { categoryServices } from "./categories.services";

const createCategories = async (req: Request, res: Response) => {
  try {
    const result = await categoryServices.createCategories(req.body);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryServices.getAllCategory();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all category data",
    });
  }
};

const getSingleCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await categoryServices.getSingleCategory(id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, tutorIds } = req.body;

    const result = await categoryServices.updateCategory(id as string, {
      name,
      tutorIds,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteCategory = async(req: Request, res: Response) => {
    try {
        const {id} = req.params;

    const result = await categoryServices.deleteCategory(id as string);

    return res.status(200).json({
      success: true,
      data: result,
    });
    } catch (error: any) {
        return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete category",
    });
    }
}

export const categoryController = {
  createCategories,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory
};

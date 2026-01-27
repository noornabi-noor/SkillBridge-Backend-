import { Request, Response } from "express";
import { tutorServices } from "./tutor.services";

const createTutorProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        error: "Unauthorized user",
      });
    }

    const result = await tutorServices.createTutorProfile(req.body, user.id as string);

    res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create tutor profile",
      error: error.message,
    });
  }
};

const getAllTutors = async (req: Request, res: Response) => {
  try {
    const result = await tutorServices.getAllTutors();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff",
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await tutorServices.getSingleTutor(id as string);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tutor",
    });
  }
};

const updateTutorProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await tutorServices.updateTutorProfile(id as string, req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update tutor profile",
    });
  }
};

const deleteTutorProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await tutorServices.deleteTutorProfile(id as string);

    return res.status(200).json({
      success: true,
      message: "Tutor profile deleted successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete tutor profile",
    });
  }
};

export const tutorController = {
  createTutorProfile,
  getAllTutors,
  getSingleUser,
  updateTutorProfile,
  deleteTutorProfile
};

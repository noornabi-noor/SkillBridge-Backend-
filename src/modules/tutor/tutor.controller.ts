import { Request, Response } from "express";
import { tutorServices } from "./tutor.services";
import { prisma } from "../../lib/prisma";

const createTutorProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized user" });

    const result = await tutorServices.createTutorProfile(req.body, user.id);

    // Update user role to TUTOR
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "TUTOR" },
    });

    res.status(201).json({ success: true, data: result });
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
    const { id: userId } = req.params;
    const result = await tutorServices.getSingleTutor(userId as string);

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
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const result = await tutorServices.updateTutorProfile(user.id, req.body);

    res.status(200).json({ success: true, data: result });
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

const getTutorDashboardStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stats = await tutorServices.getTutorDashboardStats(id as string);

    return res.status(200).json({ success: true, data: stats });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTutorByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const tutor = await tutorServices.getSingleTutorByUserId(userId as string);
    if (!tutor)
      return res
        .status(404)
        .json({ success: false, message: "Tutor not found" });
    res.status(200).json({ success: true, data: tutor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const tutorController = {
  createTutorProfile,
  getAllTutors,
  getSingleUser,
  updateTutorProfile,
  deleteTutorProfile,
  getTutorDashboardStats,
  getTutorByUserId,
};

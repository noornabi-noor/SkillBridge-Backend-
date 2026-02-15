import { Request, Response } from "express";
import { tutorServices } from "./tutor.services";
import { prisma } from "../../lib/prisma";
import { userRoles } from "../../middleware/auth";

const createTutorProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Prevent re-becoming tutor
    if (user.role === userRoles.TUTOR) {
      return res.status(400).json({
        success: false,
        message: "You are already a tutor",
      });
    }

    const tutorProfile = await tutorServices.createTutorProfile(
      req.body,
      user.id
    );

    // Promote role
    await prisma.user.update({
      where: { id: user.id },
      data: { role: userRoles.TUTOR },
    });

    return res.status(201).json({
      success: true,
      data: tutorProfile,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
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

const getSingleTutor = async (req: Request, res: Response) => {
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

    const data = req.body;

    // Use the service function here
    const updatedProfile = await tutorServices.updateTutorProfile(user.id, data);

    return res.status(200).json({ success: true, data: updatedProfile });
  } catch (error: any) {
    console.error("UpdateTutorProfile error:", error);
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

const getTopRatedTutor = async(req: Request, res: Response) => {
  try {
    const result = await tutorServices.getTopRatedTutor();
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const tutorController = {
  createTutorProfile,
  getAllTutors,
  getSingleTutor,
  updateTutorProfile,
  deleteTutorProfile,
  getTutorDashboardStats,
  getTutorByUserId,
  getTopRatedTutor
};

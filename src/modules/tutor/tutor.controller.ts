import { Request, Response, NextFunction } from "express";
import { tutorServices } from "./tutor.services";
import { prisma } from "../../lib/prisma";
import { userRoles } from "../../middleware/auth";

const createTutorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      const err = new Error("Unauthorized");
      err.name = "UnauthorizedError";
      throw err;
    }

    if (user.role === userRoles.TUTOR) {
      const err = new Error("You are already a tutor");
      err.name = "ConflictError";
      throw err;
    }

    const tutorProfile = await tutorServices.createTutorProfile(req.body, user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { role: userRoles.TUTOR },
    });

    res.status(201).json({
      success: true,
      data: tutorProfile,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await tutorServices.getAllTutors();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getSingleTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params;
    const result = await tutorServices.getSingleTutor(userId as string);

    if (!result) {
      const err = new Error("Tutor not found");
      err.name = "NotFoundError";
      throw err;
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const updateTutorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      const err = new Error("Unauthorized");
      err.name = "UnauthorizedError";
      throw err;
    }

    const updatedProfile = await tutorServices.updateTutorProfile(user.id, req.body);

    res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    next(error);
  }
};

const deleteTutorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await tutorServices.deleteTutorProfile(id as string);

    res.status(200).json({
      success: true,
      message: "Tutor profile deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getTutorDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const stats = await tutorServices.getTutorDashboardStats(id as string);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

const getTutorByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const tutor = await tutorServices.getSingleTutorByUserId(userId as string);

    if (!tutor) {
      const err = new Error("Tutor not found");
      err.name = "NotFoundError";
      throw err;
    }

    res.status(200).json({ success: true, data: tutor });
  } catch (error) {
    next(error);
  }
};

const getTopRatedTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await tutorServices.getTopRatedTutor();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const tutorController = {
  createTutorProfile,
  getAllTutors,
  getSingleTutor,
  updateTutorProfile,
  deleteTutorProfile,
  getTutorDashboardStats,
  getTutorByUserId,
  getTopRatedTutor,
};

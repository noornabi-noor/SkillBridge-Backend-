import { Request, Response, NextFunction } from "express";
import { availabilityServices } from "./availability.services";

const createAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tutorId = req.user?.tutorProfileId;
    if (!tutorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await availabilityServices.createAvailability(req.body, tutorId);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getAllAvailabilty = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await availabilityServices.getAllAvailabilty();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getSingleAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await availabilityServices.getSingleAvailability(id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "No data provided to update" });
    }

    const { id } = req.params;
    const result = await availabilityServices.updateAvailability(id as string, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const deleteAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await availabilityServices.deleteAvailability(id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getAvailabilityByTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let tutorId = req.params.tutorId;
    if (!tutorId) {
      return res.status(400).json({ success: false, message: "Tutor ID is required" });
    }

    const result = await availabilityServices.getAvailabilityByTutor(tutorId as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getMyAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tutorId = req.user?.tutorProfileId;
    if (!tutorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await availabilityServices.getAvailabilityByTutor(tutorId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const availabiltyController = {
  createAvailability,
  getAllAvailabilty,
  getSingleAvailability,
  updateAvailability,
  deleteAvailability,
  getAvailabilityByTutor,
  getMyAvailability,
};

import { Request, Response } from "express";
import { availabilityServices } from "./availability.services";

const createAvailability = async (req: Request, res: Response) => {
  try {
    const tutorId = req.user?.tutorProfileId;
    if (!tutorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await availabilityServices.createAvailability(req.body, tutorId);

    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error("Create availability error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create availability",
      error: error.message,
    });
  }
};

const getAllAvailabilty = async (Req: Request, res: Response) => {
  try {
    const result = await availabilityServices.getAllAvailabilty();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Availabilty",
    });
  }
};

const getSingleAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await availabilityServices.getSingleAvailability(
      id as string,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Availabilty",
    });
  }
};

const updateAvailability = async (req: Request, res: Response) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided to update",
      });
    }

    const { id } = req.params;

    const result = await availabilityServices.updateAvailability(
      id as string,
      req.body
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Update availability error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await availabilityServices.deleteAvailability(id as string);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete Availabilty",
    });
  }
};

const getAvailabilityByTutor = async (req: Request, res: Response) => {
  try {
    let tutorId = req.params.tutorId;

    if (!tutorId) {
      return res.status(400).json({
        success: false,
        message: "Tutor ID is required",
      });
    }

    const result =
      await availabilityServices.getAvailabilityByTutor(tutorId as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor availability",
    });
  }
};

const getMyAvailability = async (req: Request, res: Response) => {
  try {
    const tutorId = req.user?.tutorProfileId; 
    if (!tutorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await availabilityServices.getAvailabilityByTutor(tutorId);

    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch availability",
    });
  }
};

export const availabiltyController = {
  createAvailability,
  getAllAvailabilty,
  getSingleAvailability,
  updateAvailability,
  deleteAvailability,
  getAvailabilityByTutor,
  getMyAvailability
};
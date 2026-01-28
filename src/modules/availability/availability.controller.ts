import { Request, Response } from "express";
import { availabilityServices } from "./availability.services";

const createAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await availabilityServices.createAvailability(
      req.body,
      id as string,
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
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
    const { id } = req.params;

    const result = await availabilityServices.updateAvailability(
      id as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update Availabilty",
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

export const availabiltyController = {
  createAvailability,
  getAllAvailabilty,
  getSingleAvailability,
  updateAvailability,
  deleteAvailability,
};

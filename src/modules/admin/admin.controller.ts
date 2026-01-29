import { Request, Response } from "express";
import { adminServices } from "./admin.services";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await adminServices.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await adminServices.updateUser(id as string, req.body);

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

const getAllTutor = async (req: Request, res: Response) => {
  try {
    const staff = await adminServices.getAllTutor();

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await adminServices.getAllBookings();

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.createCategory(req.body);

    res.status(201).json({
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

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await adminServices.updateCategory(id as string, req.body);

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

export const adminController = {
  getAllUsers,
  updateUser,
  getAllTutor,
  getAllBookings,
  createCategory,
  updateCategory,
};
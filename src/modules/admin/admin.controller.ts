import { Request, Response, NextFunction } from "express";
import { adminServices } from "./admin.services";

const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await adminServices.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await adminServices.updateUser(id as string, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getAllTutor = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const staff = await adminServices.getAllTutor();
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await adminServices.getAllBookings();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminServices.createCategory(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await adminServices.updateCategory(id as string, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await adminServices.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  getAllUsers,
  updateUser,
  getAllTutor,
  getAllBookings,
  createCategory,
  updateCategory,
  getDashboardStats,
};

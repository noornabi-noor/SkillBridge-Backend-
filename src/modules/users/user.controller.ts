import { Request, Response, NextFunction } from "express";
import { usersServices } from "./user.services";

const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await usersServices.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await usersServices.getUserById(id as string);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      const err = new Error("User not found!");
      err.name = "NotFoundError"; // ensures errorHandler returns 404
      throw err;
    }

    const result = await usersServices.getCurrentUser(user.id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedUser = await usersServices.updateUserStatus(id as string, status);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, image, phone } = req.body;

    const updatedUser = await usersServices.updateUserProfile(id as string, {
      name,
      email,
      image,
      phone,
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const usersController = {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserStatus,
  updateUserProfile,
};

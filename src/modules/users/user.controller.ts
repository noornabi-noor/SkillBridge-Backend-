import { Request, Response } from "express";
import { usersServices } from "./user.services";

const  getAllUsers= async (_req: Request, res: Response) => {
    try {
      const users = await usersServices.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

 const  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await usersServices.getUserById(id as string);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

const getCurrentUser = async (req: Request, res: Response) => {
    try {
      const user = req.user;

      if(!user){
        throw new Error("User not found!");
      }

      const result = await usersServices.getCurrentUser(user.id as string);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

const updateUserStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedUser = await usersServices.updateUserStatus(id as string, status);
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }


export const usersController = {
    getAllUsers,
    getUserById,
    getCurrentUser,
    updateUserStatus
}
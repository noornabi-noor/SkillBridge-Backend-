import { Request, Response } from "express";
import { authServices } from "./auth.services";

const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const user = await authServices.getMe(req.user);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({ success: true, data: user });
};

const signOut = async (req: Request, res: Response) => {
  await authServices.signOut(req.headers);
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const authController = {
  getMe,
  signOut,
};
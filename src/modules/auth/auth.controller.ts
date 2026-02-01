import { Request, Response } from "express";
import { authServices } from "./auth.services";

const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      image: req.user.image || null,
    },
  });
};


  const signOut = async (req: Request, res: Response) => {
  await authServices.signOut(req.headers);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const authController = {
  getMe,
  signOut
};

import { Request, Response, NextFunction } from "express";
import { authServices } from "./auth.services";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await authServices.getMe(req.user);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authServices.signOut(req.headers);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  getMe,
  signOut,
};

import { Request, Response, NextFunction } from "express";
import { adminAnalyticsServices } from "./adminAnalytic.services";

const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminAnalyticsServices.getDashboardData();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminAnalyticsServices.getStats();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminAnalyticsController = {
  getDashboardData,
  getStats,
};

import { Request, Response } from "express";
import { adminAnalyticsServices } from "./adminAnalytic.services";


const getDashboardData = async (req: Request, res: Response) => {
  try {
    const result = await adminAnalyticsServices.getDashboardData();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await adminAnalyticsServices.getStats();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const adminAnalyticsController = {
  getDashboardData,
  getStats,
};

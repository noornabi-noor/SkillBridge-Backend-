import express from "express";
import { adminAnalyticsController } from "./adminAnalytic.controller";

const router = express.Router();

router.get("/dashboard", adminAnalyticsController.getDashboardData);
router.get("/stats", adminAnalyticsController.getStats);

export const adminAnalyticsRouter = router;

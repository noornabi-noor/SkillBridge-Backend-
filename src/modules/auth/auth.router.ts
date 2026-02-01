import express from "express";
import { authController } from "./auth.controller";
import { auth, userRoles } from "../../middleware/auth";

const router = express.Router();

router.get("/", auth(), authController.getMe);
router.post("/sign-out", auth(), authController.signOut);

router.get("/tutor-only", auth(userRoles.TUTOR), (req, res) => {
  res.json({ success: true, message: `Hello ${req.user?.name}, you are a tutor!` });
});

export const authRouter = router;

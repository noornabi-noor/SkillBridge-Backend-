import express from "express";
import { paymentController } from "./payment.controller";
import { auth, userRoles } from "../../middleware/auth";

const router = express.Router();

router.post("/create-checkout-session", auth(userRoles.STUDENT), paymentController.createCheckoutSession);
router.post("/webhook", paymentController.handleWebhook);
router.post("/verify", auth(userRoles.STUDENT), paymentController.verifyPayment);

export const paymentRouter = router;

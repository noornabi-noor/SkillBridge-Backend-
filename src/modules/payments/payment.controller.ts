import { Request, Response } from "express";
import { paymentServices } from "./payment.services";

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    const user = (req as any).user; // Assuming user is attached by auth middleware

    if (!user || !user.email) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const result = await paymentServices.createCheckoutSession(bookingId, user.email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const payload = req.body;

  try {
    const result = await paymentServices.handleWebhook(sig, payload);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { sessionId, bookingId } = req.body;
    const result = await paymentServices.verifyPayment(sessionId, bookingId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  verifyPayment,
};

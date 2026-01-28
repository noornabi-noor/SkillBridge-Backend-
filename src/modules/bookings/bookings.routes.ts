import express from "express";
import { bookingController } from "./bookings.controller";

const router = express.Router();

router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.post("/", bookingController.createBooking);
router.patch("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);

export const bookingRouter = router;
import express from "express";
import { bookingController } from "./bookings.controller";
import { auth, userRoles } from "../../middleware/auth";

const router = express.Router();

router.get("/tutor/:id/upcoming", auth(userRoles.TUTOR), bookingController.getUpcomingBookingsByTutor);
router.get("/tutor/:id", auth(userRoles.TUTOR), bookingController.getBookingsByTutor);
router.get("/", auth(userRoles.ADMIN, userRoles.TUTOR), bookingController.getAllBookings);
router.get("/:id", auth(userRoles.ADMIN, userRoles.TUTOR), bookingController.getBookingById);
router.post("/", auth(userRoles.STUDENT), bookingController.createBooking);
router.patch("/:id", auth(userRoles.ADMIN, userRoles.TUTOR), bookingController.updateBooking);
router.delete("/:id", auth(userRoles.ADMIN, userRoles.TUTOR), bookingController.deleteBooking);

export const bookingRouter = router;
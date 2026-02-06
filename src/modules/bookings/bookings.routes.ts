import express from "express";
import { bookingController } from "./bookings.controller";
import { auth, userRoles } from "../../middleware/auth";

const router = express.Router();

router.get("/tutor/:id/upcoming", auth(userRoles.TUTOR), bookingController.getUpcomingBookingsByTutor);
router.get("/student/me",auth(userRoles.STUDENT),bookingController.getMyBookings);
router.get("/tutor/:tutorId/public", auth(userRoles.STUDENT), bookingController.getTutorPublicBookings);
router.get("/tutor/:id", auth(userRoles.TUTOR), bookingController.getBookingsByTutor);
router.get("/", auth(), bookingController.getAllBookings);
router.get("/:id", auth(userRoles.ADMIN, userRoles.TUTOR), bookingController.getBookingById);
router.post("/", auth(userRoles.STUDENT), bookingController.createBooking);
router.patch("/:id", auth(userRoles.ADMIN, userRoles.TUTOR, userRoles.STUDENT), bookingController.updateBooking);
router.delete("/:id", auth(userRoles.ADMIN, userRoles.TUTOR), bookingController.deleteBooking);

export const bookingRouter = router;
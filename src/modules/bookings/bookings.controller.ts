import { Request, Response, NextFunction } from "express";
import { bookingServices } from "./bookings.services";
import { prisma } from "../../lib/prisma";

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user!.id;

    const result = await bookingServices.createBooking(studentId, {
      tutorId: req.body.tutorId,
      date: new Date(req.body.date),
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookingServices.getAllBookings();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await bookingServices.getBookingById(id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const booking = await bookingServices.getBookingById(id as string);

    // ✅ STUDENT: only own booking
    if (user.role === "STUDENT" && booking.studentId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ✅ TUTOR: must match TutorProfile ID
    if (user.role === "TUTOR" && booking.tutorId !== user.tutorProfileId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ✅ STATUS RULES
    const allowedStatus: Record<string, string[]> = {
      STUDENT: ["CANCELLED"],
      TUTOR: ["CONFIRMED", "COMPLETED", "CANCELLED"],
      ADMIN: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
    };

    if (req.body.status && !allowedStatus[user.role]?.includes(req.body.status)) {
      return res.status(403).json({ message: "Invalid status change" });
    }

    const result = await bookingServices.updateBooking(id as string, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await bookingServices.deleteBooking(id as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getBookingsByTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const bookings = await bookingServices.getBookingsByTutor(id as string);
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

const getUpcomingBookingsByTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let tutorId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!tutorId) return res.status(400).json({ success: false, message: "Tutor ID is required" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await prisma.booking.findMany({
      where: {
        tutorId,
        date: { gte: today },
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      include: { student: { select: { id: true, name: true } } },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user!.id;
    const bookings = await prisma.booking.findMany({
      where: { studentId },
      include: {
        tutor: {
          select: {
            id: true,
            user: { select: { id: true, name: true, image: true } },
            bio: true,
            pricePerHour: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

const getTutorPublicBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let tutorId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!tutorId) return res.status(400).json({ success: false, message: "Tutor ID is required" });

    const bookings = await prisma.booking.findMany({
      where: {
        tutorId,
        status: { in: ["PENDING", "CONFIRMED"] },
        date: { gte: new Date() },
      },
      select: { id: true, date: true, startTime: true, endTime: true, status: true },
      orderBy: { date: "asc" },
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByTutor,
  getUpcomingBookingsByTutor,
  getMyBookings,
  getTutorPublicBookings,
};

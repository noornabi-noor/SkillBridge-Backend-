import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";
import { prisma } from "../../lib/prisma";

const createBooking = async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.id;

    const result = await bookingServices.createBooking(studentId, {
      tutorId: req.body.tutorId,
      date: new Date(req.body.date),  // convert string to Date
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const result = await bookingServices.getAllBookings();

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

const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await bookingServices.getBookingById(id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const booking = await bookingServices.getBookingById(id as string);

    // ✅ STUDENT: only own booking
    if (
      user.role === "STUDENT" &&
      booking.studentId !== user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ✅ TUTOR: must match TutorProfile ID
    if (
      user.role === "TUTOR" &&
      booking.tutorId !== user.tutorProfileId
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ✅ STATUS RULES
    const allowedStatus: Record<string, string[]> = {
      STUDENT: ["CANCELLED"],
      TUTOR: ["CONFIRMED", "COMPLETED", "CANCELLED"],
      ADMIN: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
    };

    if (
      req.body.status &&
      !allowedStatus[user.role]?.includes(req.body.status)
    ) {
      return res.status(403).json({ message: "Invalid status change" });
    }

    const result = await bookingServices.updateBooking(id as string, req.body);

    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await bookingServices.deleteBooking(id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookingsByTutor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookings = await bookingServices.getBookingsByTutor(id as string);

    return res.status(200).json({ success: true, data: bookings });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUpcomingBookingsByTutor = async (req: Request, res: Response) => {
  try {
    let tutorId = req.params.id;

    // Ensure tutorId is a string, not an array
    if (Array.isArray(tutorId)) {
      tutorId = tutorId[0]; // pick the first one
    }

    if (!tutorId) {
      return res.status(400).json({ success: false, message: "Tutor ID is required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await prisma.booking.findMany({
      where: {
        tutorId, // ✅ now TypeScript is happy
        date: { gte: today },
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      include: { student: { select: { id: true, name: true } } },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch upcoming bookings" });
  }
};

const getMyBookings = async (req: Request, res: Response) => {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};

const getTutorPublicBookings = async (req: Request, res: Response) => {
  // const { tutorId } = req.params;

  let tutorId = req.params.id;

    // Ensure tutorId is a string, not an array
    if (Array.isArray(tutorId)) {
      tutorId = tutorId[0]; // pick the first one
    }

    if (!tutorId) {
      return res.status(400).json({ success: false, message: "Tutor ID is required" });
    }

  const bookings = await prisma.booking.findMany({
    where: {
      tutorId,
      status: { in: ["PENDING", "CONFIRMED"] }, // only blocking ones
      date: { gte: new Date() },
    },
    select: {
      id: true,
      date: true,
      startTime: true,
      endTime: true,
      status: true,
    },
    orderBy: { date: "asc" },
  });

  res.json({ data: bookings });
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
  getTutorPublicBookings
};

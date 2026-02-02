import { prisma } from "../../lib/prisma";

const createBooking = async (
  studentId: string,
  data: {
    tutorId: string;
    date: Date;
    startTime: string;
    endTime: string;
  },
) => {
  return prisma.booking.create({
    data: {
      tutorId: data.tutorId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: "PENDING",
      studentId,
    },
  });
};

const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      tutor: {
        select: {
          id: true,
          bio: true,
          pricePerHour: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


const getBookingById = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutor: true,
      student: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
};

const updateBooking = async (
  bookingId: string,
  data: {
    date?: Date;
    startTime?: string;
    endTime?: string;
    status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  },
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data,
  });
};

const deleteBooking = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return prisma.booking.delete({
    where: { id: bookingId },
  });
};

const getBookingsByTutor = async (tutorProfileId: string) => {
  return prisma.booking.findMany({
    where: { tutorId: tutorProfileId },
    include: {
      student: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getUpcomingBookingsByTutor = async (tutorProfileId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today

  return prisma.booking.findMany({
    where: {
      tutorId: tutorProfileId,
      date: { gte: today }, // include today
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    include: {
      student: { select: { id: true, name: true } },
    },
    orderBy: { date: "asc" },
  });
};


export const bookingServices = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByTutor,
  getUpcomingBookingsByTutor,
};

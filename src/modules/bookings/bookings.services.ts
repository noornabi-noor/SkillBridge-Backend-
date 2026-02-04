import { prisma } from "../../lib/prisma";

// const createBooking = async (
//   studentId: string,
//   data: {
//     tutorId: string;
//     date: Date;
//     startTime: string;
//     endTime: string;
//   },
// ) => {
//   const hasConflict = await prisma.booking.findFirst({
//     where: {
//       tutorId: data.tutorId,
//       date: data.date,
//       status: { in: ["PENDING", "CONFIRMED"] },
//       OR: [
//         {
//           startTime: { lt: data.endTime },
//           endTime: { gt: data.startTime },
//         },
//       ],
//     },
//   });

//   if (hasConflict) {
//     throw new Error("This time slot is already booked");
//   }

//   return prisma.booking.create({
//     data: {
//       tutorId: data.tutorId,
//       date: data.date,
//       startTime: data.startTime,
//       endTime: data.endTime,
//       status: "PENDING",
//       studentId,
//     },
//   });
// };

const createBooking = async (
  studentId: string,
  data: {
    tutorId: string;
    date: Date;
    startTime: string;
    endTime: string;
  },
) => {
  // Start and end of the day for the tutor
  const startOfDay = new Date(data.date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(data.date);
  endOfDay.setHours(23, 59, 59, 999);

  // Check **only for overlapping time slots for this tutor**
  const hasConflict = await prisma.booking.findFirst({
    where: {
      tutorId: data.tutorId, // same tutor
      date: { gte: startOfDay, lte: endOfDay },
      status: { in: ["PENDING", "CONFIRMED"] },
      AND: [
        { startTime: { lt: data.endTime } },
        { endTime: { gt: data.startTime } },
      ],
    },
  });

  if (hasConflict) {
    throw new Error("This time slot is already booked for this tutor");
  }

  // ✅ Create booking
  return prisma.booking.create({
    data: {
      tutorId: data.tutorId,
      studentId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: "PENDING",
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

// const getUpcomingBookingsByTutor = async (tutorProfileId: string) => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   return prisma.booking.findMany({
//     where: {
//       tutorId: tutorProfileId,
//       date: { gte: today },
//       status: { in: ["CONFIRMED", "PENDING"] },
//     },
//     include: {
//       student: { select: { id: true, name: true } },
//     },
//     orderBy: { date: "asc" },
//   });
// };

const getUpcomingBookingsByTutor = async (
  tutorProfileId: string,
  studentId?: string,
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.booking.findMany({
    where: {
      tutorId: tutorProfileId,
      ...(studentId && { studentId }), // optional filter for current student
      date: { gte: today },
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    include: { student: { select: { id: true, name: true } } },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
};

const getBookingsByStudent = async (studentId: string) => {
  return prisma.booking.findMany({
    where: {
      studentId: studentId,
    },
    include: {
      tutor: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
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
  getBookingsByStudent,
};

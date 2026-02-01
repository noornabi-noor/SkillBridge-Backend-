import { Availability } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createAvailability = async (
  data: Omit<
    Availability,
    "id" | "createdAt" | "updatedAt" | "isBooked" | "tutor" | "tutorId"
  >,
  tutorId: string,
) => {
  return await prisma.availability.create({
    data: {
      ...data,
      dayOfWeek: Number(data.dayOfWeek),
      tutorId,
    },
  });
};

const getAllAvailabilty = async () => {
  return await prisma.availability.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      isBooked: true,
      createdAt: true,

      tutor: {
        select: {
          id: true,
          bio: true,
          pricePerHour: true,
          experience: true,
          rating: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

const getSingleAvailability = async (availabilityId: string) => {
  const availabilityData = await prisma.availability.findUnique({
    where: {
      id: availabilityId,
    },
  });

  if (!availabilityData) {
    throw new Error("Cannot fetch availability data");
  }

  return await prisma.availability.findUnique({
    where: {
      id: availabilityId,
    },
    select: {
      id: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      isBooked: true,
      createdAt: true,

      tutor: {
        select: {
          id: true,
          bio: true,
          pricePerHour: true,
          experience: true,
          rating: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

const updateAvailability = async (
  availabilityId: string,
  data: Partial<
    Pick<Availability, "dayOfWeek" | "startTime" | "endTime" | "isBooked">
  >,
) => {
  const availabilityData = await prisma.availability.findUnique({
    where: { id: availabilityId },
  });

  if (!availabilityData) {
    throw new Error("Cannot fetch availability data");
  }

  return prisma.availability.update({
    where: { id: availabilityId },
    data: {
      ...(data.dayOfWeek !== undefined && {
        dayOfWeek: Number(data.dayOfWeek),
      }),
      ...(data.startTime && { startTime: data.startTime }),
      ...(data.endTime && { endTime: data.endTime }),
      ...(data.isBooked !== undefined && { isBooked: data.isBooked }),
    },
  });
};

const deleteAvailability = async (avilabilityId: string) => {
  return await prisma.availability.delete({
    where: {
      id: avilabilityId,
    },
  });
};

export const availabilityServices = {
  createAvailability,
  getAllAvailabilty,
  getSingleAvailability,
  updateAvailability,
  deleteAvailability,
};

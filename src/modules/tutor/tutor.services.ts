import { TutorProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createTutorProfile = async (
  data: Omit<
    TutorProfile,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "availability"
    | "user"
    | "bookings"
    | "reviews"
    | "categories"
  >,
  userId: string,
) => {
  return await prisma.tutorProfile.create({
    data: {
      ...data,
      userId,
    },
  });
};

const getAllTutors = async () => {
  return await prisma.tutorProfile.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      reviews: true,
    },
  });
};

const getSingleTutor = async (userId: string) => {
  return await prisma.tutorProfile.findUnique({
    where: {
      id: userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      availability: {
        where: {
          isBooked: false,
        },
        orderBy: {
          dayOfWeek: "asc",
        },
      },
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
};

const updateTutorProfile = async (userId: string, data: Partial<TutorProfile>) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutor) {
    throw new Error("Tutor profile not found");
  }

  const updateData: Partial<TutorProfile> = {};

  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.pricePerHour !== undefined) updateData.pricePerHour = data.pricePerHour;
  if (data.experience !== undefined) updateData.experience = data.experience;

  return prisma.tutorProfile.update({
    where: {
        userId
    },
    data: updateData,
  });
};

const deleteTutorProfile = async(userId: string) => {
    const tutorData = await prisma.tutorProfile.findUnique({
        where: {
            id: userId
        }
    });

    if(!tutorData){
        throw new Error("Tutor profile not found");
    }

    return prisma.tutorProfile.delete({
        where: {
            id: userId
        }
    });
};

export const tutorServices = {
  createTutorProfile,
  getAllTutors,
  getSingleTutor,
  updateTutorProfile,
  deleteTutorProfile
};

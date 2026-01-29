import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUser = async (
  userId: string,
  data: {
    role?: "STUDENT" | "TUTOR" | "ADMIN";
    isBlocked?: boolean;
  }
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

const getAllTutor = async () => {
  return prisma.tutorProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
};

const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tutor: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
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

const createCategory = async (data: { name: string }) => {
  return prisma.category.create({
    data,
  });
};

const updateCategory = async (
  categoryId: string,
  data: { name?: string }
) => {
  return prisma.category.update({
    where: { id: categoryId },
    data,
  });
};

export const adminServices = {
    getAllUsers,
    updateUser,
    getAllTutor,
    getAllBookings,
    createCategory,
    updateCategory,
}
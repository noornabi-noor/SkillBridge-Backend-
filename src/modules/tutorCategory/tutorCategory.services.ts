import { prisma } from "../../lib/prisma";
import { TutorCategory } from "../../../generated/prisma/client";

const addTutorToCategory = async (
  data: Omit<TutorCategory, "id">
) => {
  return prisma.tutorCategory.create({
    data,
  });
};

const getTutorCategories = async (
  tutorId?: string,
  categoryId?: string
) => {
  return prisma.tutorCategory.findMany({
    where: {
      ...(tutorId && { tutorId }),
      ...(categoryId && { categoryId }),
    },
    include: {
      tutor: {
        select: {
          id: true,
          bio: true,
          pricePerHour: true,
          experience: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const removeTutorFromCategory = async (id: string) => {
  const data = await prisma.tutorCategory.findUnique({
    where: { id },
  });

  if (!data) {
    throw new Error("TutorCategory not found");
  }

  return prisma.tutorCategory.delete({
    where: { id },
  });
};

export const tutorCategoryServices = {
  addTutorToCategory,
  getTutorCategories,
  removeTutorFromCategory,
};

import { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// const createReview = async (
//   data: Omit<Review, "id" | "createdAt" | "updatedAt" | "student" | "tutor" | "booking">
// ) => {
//   return prisma.review.create({
//     data,
//   });
// };

const createReview = async (
  data: Omit<Review, "id" | "createdAt" | "updatedAt" | "student" | "tutor" | "booking">
) => {
  
  const review = await prisma.review.create({
    data,
  });

  const reviews = await prisma.review.findMany({
    where: { tutorId: data.tutorId },
  });

  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

  await prisma.tutorProfile.update({
    where: { id: data.tutorId },
    data: {
      rating: averageRating,
      totalReviews: totalReviews,
    },
  });

  return review;
};

const getReviews = async (tutorId?: string, studentId?: string) => {
  return prisma.review.findMany({
    where: {
      ...(tutorId && { tutorId }),
      ...(studentId && { studentId }),
    },
    include: {
      student: true,
      tutor: true,
      booking: true,
    },
  });
};

const updateReview = async (
  reviewId: string,
  data: Partial<Pick<Review, "rating" | "comment">>
) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("Review not found");

  return prisma.review.update({
    where: { id: reviewId },
    data,
  });
};

const deleteReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("Review not found");

  return prisma.review.delete({ where: { id: reviewId } });
};


export const reviewServices = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
};

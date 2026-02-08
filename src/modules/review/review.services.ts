import { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

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
      tutor: {
        include: { user: true },
      },
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

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data,
  });

  const reviews = await prisma.review.findMany({
    where: { tutorId: review.tutorId },
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  await prisma.tutorProfile.update({
    where: { id: review.tutorId },
    data: { rating: averageRating },
  });

  return updated;
};


const deleteReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) throw new Error("Review not found");

  const tutorId = review.tutorId;
  await prisma.review.delete({
    where: { id: reviewId },
  });
  const remainingReviews = await prisma.review.findMany({
    where: { tutorId },
  });

  const totalReviews = remainingReviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : remainingReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: {
      rating: averageRating,
      totalReviews,
    },
  });

  return true;
};

const getReviewsByTutor = async (tutorId: string) => {
  return await prisma.review.findMany({
    where: { tutorId },
    include: { student: true },
    orderBy: { createdAt: "desc" },
  });
};

export const reviewServices = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getReviewsByTutor
};

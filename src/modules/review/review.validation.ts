import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
  tutorId: z.string().min(1),
  studentId: z.string().min(1),
  bookingId: z.string().min(1),
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});

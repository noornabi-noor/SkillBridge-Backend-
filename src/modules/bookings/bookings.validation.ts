import { z } from "zod";

export const createBookingSchema = z.object({
  tutorId: z.string().min(1),
  date: z.string().min(1), // Should be ISO date string
  startTime: z.string().min(1),
  endTime: z.string().min(1),
});

export const updateBookingSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  date: z.string().optional(),
});

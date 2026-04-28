import { z } from "zod";

export const createAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
});

export const updateAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isBooked: z.boolean().optional(),
});

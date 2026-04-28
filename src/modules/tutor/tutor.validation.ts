import { z } from "zod";

export const createTutorProfileSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  experience: z.string().min(1, "Experience is required"),
  pricePerHour: z.number().positive("Price per hour must be positive"),
  categories: z.array(z.string()).optional(),
});

export const updateTutorProfileSchema = createTutorProfileSchema.partial();

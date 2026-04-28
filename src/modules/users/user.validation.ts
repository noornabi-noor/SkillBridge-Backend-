import { z } from "zod";

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BANNED"]),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
  phone: z.string().optional(),
});

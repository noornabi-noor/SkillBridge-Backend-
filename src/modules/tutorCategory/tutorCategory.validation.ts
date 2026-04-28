import { z } from "zod";

export const createTutorCategorySchema = z.object({
  tutorId: z.string().min(1),
  categoryId: z.string().min(1),
});

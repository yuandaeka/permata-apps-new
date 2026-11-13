import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(255).optional(),
  preferredLanguage: z.string().optional(),
  phone: z.string().max(20).optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

import { z } from 'zod';

export const createChildSchema = z.object({
  displayName: z.string().min(1).max(255),
  birthDate: z.string().datetime().optional(),
  ageGroup: z.enum(['TODDLER', 'PRESCHOOL', 'EARLY_SCHOOL', 'MIDDLE_SCHOOL', 'TEEN']).optional(),
  regionId: z.string().uuid().optional(),
  preferredLanguage: z.string().default('id'),
});

export const updateChildSchema = createChildSchema.partial();

export const guardianRelationSchema = z.object({
  guardianUserId: z.string().uuid(),
  relationshipType: z.enum(['PARENT', 'GUARDIAN', 'GRANDPARENT', 'SIBLING', 'OTHER']),
});

export const consentSchema = z.object({
  consentType: z.string().min(1),
  status: z.enum(['GRANTED', 'WITHDRAWN']),
  policyVersion: z.string().min(1),
});

export type CreateChildDto = z.infer<typeof createChildSchema>;
export type UpdateChildDto = z.infer<typeof updateChildSchema>;
export type GuardianRelationDto = z.infer<typeof guardianRelationSchema>;
export type ConsentDto = z.infer<typeof consentSchema>;

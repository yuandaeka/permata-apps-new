import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['SCHOOL', 'NGO', 'GOVERNMENT', 'HEALTH_FACILITY', 'COMMUNITY', 'OTHER']),
  description: z.string().max(2000).optional(),
  regionId: z.string().uuid().optional(),
  website: z.string().url().optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const addMemberSchema = z.object({
  userId: z.string().uuid(),
  roleCode: z.string().min(1),
});

export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationDto = z.infer<typeof updateOrganizationSchema>;
export type AddMemberDto = z.infer<typeof addMemberSchema>;

import { z } from 'zod';

export const memberSchema = z.object({
  full_name:  z.string().min(2, 'Full name is required'),
  phone:      z.string().regex(/^\+?[0-9\s\-]{7,15}$/, 'Enter a valid phone number'),
  email:      z.string().email('Enter a valid email').optional().or(z.literal('')),
  department: z.enum(['choir', 'ushers', 'elders', 'media', 'welfare', 'youths', 'general']),
  role:       z.enum(['admin', 'secretary', 'member']),
  gender:     z.enum(['male', 'female']).optional(),
  is_active:  z.boolean().default(true),
  notes:      z.string().max(500).optional(),
});

export type MemberFormData = z.infer<typeof memberSchema>;

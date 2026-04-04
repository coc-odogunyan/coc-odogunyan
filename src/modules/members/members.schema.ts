import { z } from 'zod';

export const memberSchema = z.object({
  full_name:  z.string().min(2, 'Full name is required'),
  phone:      z.string().regex(/^\+?[0-9\s\-]{7,15}$/, 'Enter a valid phone number'),
  email:      z.string().email('Enter a valid email').optional().or(z.literal('')),
  department: z.enum(['counselling', 'benevolence', 'building', 'media', 'ushering', 'disciplinary']),
  role:       z.enum(['admin', 'secretariat']),
  gender:     z.enum(['male', 'female']).optional(),
  status:     z.enum(['active', 'disfellowshipped']).default('active'),
  notes:      z.string().max(500).optional(),
});

export type MemberFormData = z.infer<typeof memberSchema>;

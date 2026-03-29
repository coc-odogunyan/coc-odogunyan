import { z } from 'zod';

export const serviceSchema = z.object({
  service_type: z.enum(['sunday', 'wednesday', 'friday', 'special']),
  service_date: z.string().min(1, 'Date is required'),
  service_time: z.string().optional(),
  theme:        z.string().max(200).optional(),
  notes:        z.string().max(1000).optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

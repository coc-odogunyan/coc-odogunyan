import { z } from 'zod';

export const eventSchema = z.object({
  title:       z.string().min(3, 'Title is required').max(100),
  description: z.string().max(2000).optional(),
  event_date:  z.string().min(1, 'Date is required'),
  event_time:  z.string().optional(),
  event_type:  z.enum(['announcement', 'program', 'outreach', 'special']),
  location:    z.string().max(200).optional(),
  is_published: z.boolean().default(false),
});

export type EventFormData = z.infer<typeof eventSchema>;

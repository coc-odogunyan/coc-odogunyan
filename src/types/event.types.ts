export type EventType = 'announcement' | 'program' | 'outreach' | 'special';

export interface ChurchEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  event_type: EventType;
  location: string | null;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

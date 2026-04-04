import { api } from '@/lib/api';
import type { ChurchEvent, EventType } from '@/types';

export interface CreateEventBody {
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  event_type: EventType;
  location?: string;
  is_published?: boolean;
  created_by: string;
}

export interface UpdateEventBody {
  title?: string;
  description?: string;
  event_date?: string;
  event_time?: string;
  event_type?: EventType;
  location?: string;
  is_published?: boolean;
}

export const eventsApi = {
  getAll() {
    return api.get<ChurchEvent[]>('get-events');
  },

  create(body: CreateEventBody) {
    return api.post<ChurchEvent>('create-event', body);
  },

  update(id: string, body: UpdateEventBody) {
    return api.patch<ChurchEvent>('update-event', { id }, body);
  },
};

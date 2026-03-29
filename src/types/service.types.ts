export type ServiceType = 'sunday' | 'wednesday' | 'friday' | 'special';

export interface Service {
  id: string;
  service_type: ServiceType;
  service_date: string;
  service_time: string | null;
  theme: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
}

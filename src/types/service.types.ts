export type ServiceType = 'sunday' | 'wednesday' | 'friday' | 'fasting' | 'evangelism' | 'special';

export interface Service {
  id: string;
  service_type: ServiceType;
  service_date: string;
  service_time: string | null;
  theme: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceWithRelations extends Service {
  attendance_sessions: { id: string; status: AttendanceSessionStatus }[];
  duty_assignments: { id: string }[];
}

export type AttendanceSessionStatus = 'not-marked' | 'in-progress' | 'complete';

export interface AttendanceSession {
  id: string;
  service_id: string;
  status: AttendanceSessionStatus;
  created_at: string;
  updated_at: string;
}

export interface AttendanceSessionSummary extends AttendanceSession {
  services: Pick<Service, 'id' | 'service_type' | 'service_date' | 'service_time' | 'theme'>;
  total_members: number;
  present_count: number;
  absent_count: number;
  excused_count: number;
}

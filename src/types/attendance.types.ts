import type { Member } from './member.types';

export type AttendanceStatus = 'present' | 'absent' | 'excused';

export interface AttendanceRecord {
  id: string;
  session_id: string;
  member_id: string;
  status: AttendanceStatus;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecordWithMember extends AttendanceRecord {
  profiles: Pick<Member, 'id' | 'full_name' | 'department'>;
}

export interface RollEntry {
  member_id: string;
  full_name: string;
  department: string;
  status: AttendanceStatus | null;
}

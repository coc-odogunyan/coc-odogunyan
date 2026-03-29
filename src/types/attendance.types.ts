import type { Member } from './member.types';

export type AttendanceStatus = 'present' | 'absent' | 'excused';

export interface AttendanceRecord {
  id: string;
  service_id: string;
  member_id: string;
  status: AttendanceStatus;
  marked_by: string;
  marked_at: string;
}

export interface AttendanceRecordWithMember extends AttendanceRecord {
  member: Pick<Member, 'id' | 'full_name' | 'department'>;
}

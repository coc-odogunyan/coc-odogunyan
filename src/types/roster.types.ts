import type { Member } from './member.types';
import type { Service } from './service.types';

export type AssignmentStatus = 'assigned' | 'confirmed' | 'reminded' | 'swapped' | 'declined';

export interface DutyRole {
  id: string;
  name: string;
  department: string | null;
  description: string | null;
}

export interface DutyAssignment {
  id: string;
  service_id: string;
  member_id: string;
  duty_role: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DutyAssignmentWithMember extends DutyAssignment {
  profiles: Pick<Member, 'id' | 'full_name' | 'department'>;
}

export interface DutyAssignmentFull extends DutyAssignment {
  member: Pick<Member, 'id' | 'full_name' | 'phone' | 'department'>;
  service: Service;
}

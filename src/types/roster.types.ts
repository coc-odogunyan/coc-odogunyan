import type { Member } from './member.types';
import type { Department } from './member.types';
import type { Service } from './service.types';

export type AssignmentStatus = 'assigned' | 'confirmed' | 'reminded' | 'swapped' | 'declined';

export interface DutyRole {
  id: string;
  name: string;
  department: Department | null;
  description: string | null;
}

export interface DutyAssignment {
  id: string;
  service_id: string;
  member_id: string;
  duty_role_id: string;
  status: AssignmentStatus;
  assigned_by: string;
  notified_at: string | null;
  created_at: string;
}

export interface DutyAssignmentFull extends DutyAssignment {
  member: Pick<Member, 'id' | 'full_name' | 'phone' | 'department'>;
  duty_role: DutyRole;
  service: Service;
}

import { api } from '@/lib/api';
import type { DutyAssignmentWithMember, ServiceType } from '@/types';

export interface GetRosterParams {
  service_id: string;
}

export interface AssignDutyBody {
  service_id: string;
  member_id: string;
  duty_role: string;
}

export interface RemoveDutyParams {
  assignment_id: string;
}

export const rosterApi = {
  getRoster(serviceId: string) {
    return api.get<DutyAssignmentWithMember[]>('get-roster', { service_id: serviceId });
  },

  assignDuty(body: AssignDutyBody) {
    return api.post<DutyAssignmentWithMember>('assign-duty', body);
  },

  removeDuty(assignmentId: string) {
    return api.delete<void>('remove-duty', { assignment_id: assignmentId });
  },
};

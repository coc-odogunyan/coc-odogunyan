import { api } from '@/lib/api';
import type { AttendanceSessionSummary, AttendanceSession, RollEntry } from '@/types';
import type { Service } from '@/types';

export interface AttendanceSessionDetail {
  session: AttendanceSession & { services: Service };
  roll: RollEntry[];
}

export interface SaveAttendanceBody {
  session_id: string;
  records: { member_id: string; status: string }[];
}

export interface SaveAttendanceResult {
  success: boolean;
  status: string;
}

export const attendanceApi = {
  getSessions() {
    return api.get<AttendanceSessionSummary[]>('get-attendance-sessions');
  },

  getSession(sessionId: string) {
    return api.get<AttendanceSessionDetail>('get-attendance-session', { session_id: sessionId });
  },

  save(body: SaveAttendanceBody) {
    return api.post<SaveAttendanceResult>('save-attendance', body);
  },
};

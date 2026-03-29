import type { MemberRole } from './member.types';

export interface AuthUser {
  id: string;
  email: string;
  role: MemberRole;
  full_name: string;
}

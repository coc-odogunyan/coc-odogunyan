import { useAuthContext } from '@/context/AuthContext';
import type { MemberRole } from '@/types';

export function useRole() {
  const { member } = useAuthContext();
  const role = member?.role ?? null;

  return {
    role,
    isAdmin:     role === 'admin',
    isSecretary: role === 'admin' || role === 'secretariat',
    isMember:    role !== null,
    can: (action: 'write' | 'admin') => {
      if (action === 'admin') return role === 'admin';
      if (action === 'write') return role === 'admin' || role === 'secretariat';
      return role !== null;
    },
    hasRole: (roles: MemberRole[]) => role !== null && roles.includes(role),
  };
}

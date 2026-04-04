import { api } from '@/lib/api';
import type { Member, MemberInsert, MemberUpdate } from '@/types';

export interface GetMembersParams {
  department?: string;
  status?: string;
  search?: string;
}

export const membersApi = {
  getAll(params?: GetMembersParams) {
    return api.get<Member[]>('get-members', params as Record<string, string>);
  },

  create(body: MemberInsert) {
    return api.post<Member>('create-member', body);
  },

  update(id: string, body: MemberUpdate) {
    return api.patch<Member>('update-member', { id }, body);
  },
};

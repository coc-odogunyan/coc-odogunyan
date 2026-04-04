import { api } from '@/lib/api';
import type { Member } from '@/types';

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResult {
  access_token: string;
  refresh_token: string;
  member: Member;
}

export const authApi = {
  login(body: LoginBody) {
    return api.post<LoginResult>('login', body);
  },

  logout() {
    return api.post<{ success: boolean }>('logout', {});
  },
};

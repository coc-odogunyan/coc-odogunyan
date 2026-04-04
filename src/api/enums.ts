import { api } from '@/lib/api';

export interface Enums {
  departments:  string[];
  roles:        string[];
  genders:      string[];
  statuses:     string[];
}

export const enumsApi = {
  getAll() {
    return api.get<Enums>('get-enums');
  },
};

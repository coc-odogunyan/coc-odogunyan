import { api } from '@/lib/api';

export interface Enums {
  departments:        string[];
  roles:              string[];
  genders:            string[];
  statuses:           string[];
  service_types:      string[];
  event_types:        string[];
  duty_roles_by_type: Record<string, string[]>;
}

export const enumsApi = {
  getAll() {
    return api.get<Enums>('get-enums');
  },
};

import { api } from '@/lib/api';
import type { ServiceWithRelations, ServiceType } from '@/types';

export interface CreateServiceBody {
  service_type: ServiceType;
  service_date: string;
  service_time?: string;
  theme?: string;
  notes?: string;
  created_by: string;
}

export interface GetServicesParams {
  upcoming?: boolean;
}

export const servicesApi = {
  getAll(params?: GetServicesParams) {
    return api.get<ServiceWithRelations[]>('get-services', params as Record<string, string>);
  },

  create(body: CreateServiceBody) {
    return api.post<ServiceWithRelations>('create-service', body);
  },
};

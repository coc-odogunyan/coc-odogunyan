import { useState, useEffect } from 'react';
import { enumsApi, type Enums } from '@/api/enums';

// Module-level cache — fetched once per session, shared across all consumers
let cache: Enums | null = null;
let inflight: Promise<Enums> | null = null;

function toOptions(values: string[]) {
  return values.map((v) => ({
    value: v,
    label: v.charAt(0).toUpperCase() + v.slice(1),
  }));
}

export function useEnums() {
  const [enums, setEnums] = useState<Enums | null>(cache);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;

    if (!inflight) {
      inflight = enumsApi.getAll();
    }

    inflight
      .then((data) => {
        cache = data;
        setEnums(data);
        setLoading(false);
      })
      .catch((err) => {
        inflight = null;
        setError(err instanceof Error ? err.message : 'Failed to load options');
        setLoading(false);
      });
  }, []);

  return {
    enums,
    loading,
    error,
    departmentOptions: enums ? toOptions(enums.departments) : [],
    roleOptions:       enums ? toOptions(enums.roles)       : [],
    genderOptions:     enums ? toOptions(enums.genders)     : [],
    statusOptions:     enums ? toOptions(enums.statuses)    : [],
  };
}

import { useCallback } from 'react';
import type { Profile } from '../types/api';
import { useApi } from './useApi';
import { useFetch } from './useFetch';

type UpdateProfileInput = {
  fullName?: string;
  grade?: string | null;
  subjects?: string[] | null;
};

export const useProfile = () => {
  const { request } = useApi();
  const { data, loading, error, reload } = useFetch<Profile | null>('/api/profiles', null);

  const updateProfile = useCallback(
    async (input: UpdateProfileInput) => {
      const updated = await request<Profile>('/api/profiles', {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      await reload();
      return updated;
    },
    [reload, request]
  );

  const deleteProfile = useCallback(async () => {
    await request<void>('/api/profiles', { method: 'DELETE' });
    await reload();
  }, [reload, request]);

  return {
    profile: data,
    loading,
    error,
    reload,
    updateProfile,
    deleteProfile,
  };
};

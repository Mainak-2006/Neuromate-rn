import { useCallback } from 'react';
import type { Progress } from '../types/api';
import { useApi } from './useApi';
import { useFetch } from './useFetch';

type UpdateProgressInput = {
  lessonsCompleted?: number;
  quizzesTaken?: number;
  avgScore?: number | null;
  flashcardsCreated?: number;
  streakDays?: number;
};

export const useProgress = () => {
  const { request } = useApi();
  const { data, loading, error, reload } = useFetch<Progress | null>('/api/progress', null);

  const updateProgress = useCallback(
    async (input: UpdateProgressInput) => {
      const updated = await request<Progress>('/api/progress', {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      await reload();
      return updated;
    },
    [reload, request]
  );

  const resetProgress = useCallback(async () => {
    await request<void>('/api/progress', { method: 'DELETE' });
    await reload();
  }, [reload, request]);

  return {
    progress: data,
    loading,
    error,
    reload,
    updateProgress,
    resetProgress,
  };
};

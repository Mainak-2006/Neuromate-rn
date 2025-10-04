import { useCallback } from 'react';
import type { Json, QuizAttempt } from '../types/api';
import { useApi } from './useApi';
import { useFetch } from './useFetch';

type CreateAttemptInput = {
  quizId: string;
  answers: Json;
  score?: number | null;
};

type UpdateAttemptInput = {
  answers?: Json;
  score?: number | null;
};

export const useQuizAttempts = () => {
  const { request } = useApi();
  const { data, loading, error, reload } = useFetch<QuizAttempt[]>('/api/quiz-attempts', []);

  const createAttempt = useCallback(
    async (input: CreateAttemptInput) => {
      const created = await request<QuizAttempt>('/api/quiz-attempts', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      await reload();
      return created;
    },
    [reload, request]
  );

  const updateAttempt = useCallback(
    async (id: string, input: UpdateAttemptInput) => {
      const updated = await request<QuizAttempt>(`/api/quiz-attempts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      await reload();
      return updated;
    },
    [reload, request]
  );

  const deleteAttempt = useCallback(
    async (id: string) => {
      await request<void>(`/api/quiz-attempts/${id}`, { method: 'DELETE' });
      await reload();
    },
    [reload, request]
  );

  return {
    quizAttempts: data,
    loading,
    error,
    reload,
    createAttempt,
    updateAttempt,
    deleteAttempt,
  };
};

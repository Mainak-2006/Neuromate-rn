import { useCallback } from 'react';
import type { Json, Quiz } from '../types/api';
import { useApi } from './useApi';
import { useFetch } from './useFetch';

type CreateQuizInput = {
  lessonId: string;
  questions: Json;
};

type UpdateQuizInput = Partial<CreateQuizInput>;

export const useQuizzes = () => {
  const { request } = useApi();
  const { data, loading, error, reload } = useFetch<Quiz[]>('/api/quizzes', []);

  const createQuiz = useCallback(
    async (input: CreateQuizInput) => {
      const created = await request<Quiz>('/api/quizzes', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      await reload();
      return created;
    },
    [reload, request]
  );

  const updateQuiz = useCallback(
    async (id: string, input: UpdateQuizInput) => {
      const updated = await request<Quiz>(`/api/quizzes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      await reload();
      return updated;
    },
    [reload, request]
  );

  const deleteQuiz = useCallback(
    async (id: string) => {
      await request<void>(`/api/quizzes/${id}`, { method: 'DELETE' });
      await reload();
    },
    [reload, request]
  );

  return {
    quizzes: data,
    loading,
    error,
    reload,
    createQuiz,
    updateQuiz,
    deleteQuiz,
  };
};

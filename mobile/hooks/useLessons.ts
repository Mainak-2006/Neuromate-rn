import { useCallback } from 'react';
import type { Lesson } from '../types/api';
import { useApi } from './useApi';
import { useFetch } from './useFetch';

type CreateLessonInput = {
  documentId: string;
  title: string;
  summary?: string | null;
  bullets?: string[] | null;
  keyTerms?: string[] | null;
};

type UpdateLessonInput = Partial<CreateLessonInput>;

export const useLessons = () => {
  const { request } = useApi();
  const { data, loading, error, reload } = useFetch<Lesson[]>('/api/lessons', []);

  const createLesson = useCallback(
    async (input: CreateLessonInput) => {
      const created = await request<Lesson>('/api/lessons', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      await reload();
      return created;
    },
    [reload, request]
  );

  const updateLesson = useCallback(
    async (id: string, input: UpdateLessonInput) => {
      const updated = await request<Lesson>(`/api/lessons/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      await reload();
      return updated;
    },
    [reload, request]
  );

  const deleteLesson = useCallback(
    async (id: string) => {
      await request<void>(`/api/lessons/${id}`, { method: 'DELETE' });
      await reload();
    },
    [reload, request]
  );

  return {
    lessons: data,
    loading,
    error,
    reload,
    createLesson,
    updateLesson,
    deleteLesson,
  };
};

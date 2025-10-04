import { useCallback } from 'react';
import type { Flashcard } from '../types/api';
import { useApi } from './useApi';
import { useFetch } from './useFetch';

type CreateFlashcardInput = {
  lessonId: string;
  front: string;
  back: string;
  hint?: string | null;
  nextReviewDate?: string | null;
};

type UpdateFlashcardInput = Partial<CreateFlashcardInput> & {
  reviewCount?: number;
};

export const useFlashcards = () => {
  const { request } = useApi();
  const { data, loading, error, reload } = useFetch<Flashcard[]>('/api/flashcards', []);

  const createFlashcard = useCallback(
    async (input: CreateFlashcardInput) => {
      const created = await request<Flashcard>('/api/flashcards', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      await reload();
      return created;
    },
    [reload, request]
  );

  const updateFlashcard = useCallback(
    async (id: string, input: UpdateFlashcardInput) => {
      const updated = await request<Flashcard>(`/api/flashcards/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      await reload();
      return updated;
    },
    [reload, request]
  );

  const deleteFlashcard = useCallback(
    async (id: string) => {
      await request<void>(`/api/flashcards/${id}`, { method: 'DELETE' });
      await reload();
    },
    [reload, request]
  );

  return {
    flashcards: data,
    loading,
    error,
    reload,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
  };
};

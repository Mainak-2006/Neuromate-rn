import { useCallback } from 'react';
import type { Review } from '../types/api';
import { useApi } from './useApi';
import { useFetch } from './useFetch';

type CreateReviewInput = {
  flashcardId: string;
  reviewDate?: string;
  quality: number;
  newInterval?: number | null;
  newEf?: number | null;
};

type UpdateReviewInput = Partial<CreateReviewInput>;

export const useReviews = () => {
  const { request } = useApi();
  const { data, loading, error, reload } = useFetch<Review[]>('/api/reviews', []);

  const createReview = useCallback(
    async (input: CreateReviewInput) => {
      const created = await request<Review>('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      await reload();
      return created;
    },
    [reload, request]
  );

  const updateReview = useCallback(
    async (id: string, input: UpdateReviewInput) => {
      const updated = await request<Review>(`/api/reviews/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      });
      await reload();
      return updated;
    },
    [reload, request]
  );

  const deleteReview = useCallback(
    async (id: string) => {
      await request<void>(`/api/reviews/${id}`, { method: 'DELETE' });
      await reload();
    },
    [reload, request]
  );

  return {
    reviews: data,
    loading,
    error,
    reload,
    createReview,
    updateReview,
    deleteReview,
  };
};

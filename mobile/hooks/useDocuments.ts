import { useCallback } from 'react';
import type { Document } from '../types/api';
import { useApi } from './useApi';
import { useFetch } from './useFetch';

type CreateDocumentInput = {
  text: string;
  sourceUrl?: string;
};

type UpdateDocumentInput = Partial<CreateDocumentInput>;

export const useDocuments = () => {
  const { request } = useApi();
  const { data, loading, error, reload } = useFetch<Document[]>('/api/documents', []);

  const createDocument = useCallback(
    async (input: CreateDocumentInput) => {
      const created = await request<Document>('/api/documents', {
        method: 'POST',
        body: JSON.stringify({
          text: input.text,
          sourceUrl: input.sourceUrl,
        }),
      });
      await reload();
      return created;
    },
    [reload, request]
  );

  const updateDocument = useCallback(
    async (id: string, input: UpdateDocumentInput) => {
      const updated = await request<Document>(`/api/documents/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          text: input.text,
          sourceUrl: input.sourceUrl,
        }),
      });
      await reload();
      return updated;
    },
    [reload, request]
  );

  const deleteDocument = useCallback(
    async (id: string) => {
      await request<void>(`/api/documents/${id}`, { method: 'DELETE' });
      await reload();
    },
    [reload, request]
  );

  return {
    documents: data,
    loading,
    error,
    reload,
    createDocument,
    updateDocument,
    deleteDocument,
  };
};

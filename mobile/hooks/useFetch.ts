import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useApi } from './useApi';

export const useFetch = <T>(path: string, defaultValue: T) => {
  const { request } = useApi();
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await request<T>(path, { method: 'GET' });
      setData(result);
    } catch (err) {
      console.error(`Failed to fetch ${path}`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [path, request]);

  useEffect(() => {
    void load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  return { data, loading, error, reload: load };
};

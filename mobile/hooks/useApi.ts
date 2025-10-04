import { useAuth } from '@clerk/clerk-expo';
import { useCallback } from 'react';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export const useApi = () => {
  const { getToken, isLoaded } = useAuth();

  const request = useCallback(
    async <T>(path: string, init: RequestInit & { method?: HttpMethod } = {}): Promise<T> => {
      if (!API_BASE_URL) {
        throw new Error('Missing EXPO_PUBLIC_API_URL. Please set it in your mobile/.env file.');
      }

      if (!isLoaded) {
        throw new Error('Auth is not ready yet.');
      }

      const token = await getToken();

      if (!token) {
        throw new Error('Unable to retrieve authentication token.');
      }

      const { headers, ...rest } = init;

      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(headers ?? {}),
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with status ${response.status}`);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    },
    [getToken, isLoaded]
  );

  return { request };
};

import { isAxiosError } from 'axios';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data: unknown = error.response?.data;
    if (typeof data === 'string' && data.length > 0) return data;
    if (data && typeof data === 'object') {
      if ('error' in data && typeof data.error === 'string') return data.error;
      if ('message' in data && typeof data.message === 'string') return data.message;
    }
    if (error.response?.status) return `${fallback} (HTTP ${error.response.status})`;
    if (error.message) return `${fallback} (${error.message})`;
  }
  return fallback;
}

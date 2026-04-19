
import { ServiceResponse, ApiError } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ServiceResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers,
    });

    if (!response.ok) {
      let error: ApiError = { message: `Request failed with status: ${response.status}` };
      try {
        const errorData = await response.json();
        error = {
            message: errorData.message || error.message,
            code: errorData.code,
        };
      } catch (e) {
        // Not a JSON response or failed to parse
      }
      return { success: false, data: null, error };
    }

    if (response.status === 204) {
      return { success: true, data: null, error: null };
    }

    const data: T = await response.json();
    return { success: true, data, error: null };
  } catch (error: any) {
    console.error('API request failed:', error);
    return { success: false, data: null, error: { message: error.message || 'A network error occurred.' } };
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: any, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

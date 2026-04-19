
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
  
  // The backend will use HttpOnly cookies for session management.
  // The browser will automatically send the cookie on each request.
  // We set `credentials: 'include'` to ensure this happens.

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // Important for cookie-based auth
      headers,
    });

    if (!response.ok) {
      let error: ApiError = { message: `HTTP error! status: ${response.status}` };
      try {
        const errorData = await response.json();
        error = {
            message: errorData.message || error.message,
            code: errorData.code,
        };
      } catch (e) {
        // Not a JSON response, stick with the generic HTTP error
      }
      return { data: null, error, status: response.status };
    }

    // Handle responses with no content (e.g., DELETE, 204 No Content)
    if (response.status === 204) {
      return { data: null as T, error: null, status: 204 };
    }

    const data: T = await response.json();
    return { data, error: null, status: response.status };
  } catch (error: any) {
    console.error('API request failed:', error);
    return { data: null, error: { message: error.message || 'Network request failed' }, status: 500 };
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: any, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

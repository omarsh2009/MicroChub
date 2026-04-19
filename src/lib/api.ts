
import { ServiceResponse } from './types';

// In a real application, this would be in a .env file
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ServiceResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // This is a placeholder for real auth. In a real app, you'd get the token
  // from a secure cookie or storage and add the Authorization header.
  // const token = (typeof window !== 'undefined') ? localStorage.getItem('auth_token') : null;
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  // }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Not a JSON response
      }
      return { data: null, error: errorMessage, status: response.status };
    }

    // Handle responses with no content (e.g., DELETE, 204 No Content)
    if (response.status === 204) {
      return { data: null as T, error: null, status: 204 };
    }

    const data: T = await response.json();
    return { data, error: null, status: response.status };
  } catch (error: any) {
    console.error('API request failed:', error);
    return { data: null, error: error.message || 'Network request failed', status: 500 };
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: any, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

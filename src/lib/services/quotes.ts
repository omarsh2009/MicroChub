
import type { Product, QuoteRequestWithUserData, SelectedConfiguration, ServiceResponse } from '../types';
import { api } from '@/lib/api';

interface QuoteRequestPayload {
  product: Product;
  quantity: number;
  configuration: SelectedConfiguration;
  basePrice: number;
  userNotes?: string;
  file?: File;
}

export async function createQuoteRequest(payload: QuoteRequestPayload): Promise<ServiceResponse<QuoteRequestWithUserData>> {
  // File uploads would require special handling (multipart/form-data)
  return api.post<QuoteRequestWithUserData>('/quotes', payload);
}

export async function updateUserQuoteStatus(
    quoteId: string,
    status: 'Accepted' | 'Rejected'
): Promise<ServiceResponse<void>> {
    return api.patch<void>(`/quotes/${quoteId}/status`, { status });
}

export async function getAllQuoteRequests(): Promise<ServiceResponse<QuoteRequestWithUserData[]>> {
  return api.get<QuoteRequestWithUserData[]>('/quotes');
}

export async function submitQuote(
  quoteId: string,
  price: number,
  notes: string,
): Promise<ServiceResponse<void>> {
  return api.patch<void>(`/quotes/${quoteId}`, { quotedPrice: price, adminNotes: notes, status: 'Quoted' });
}

export async function getUserQuotes(): Promise<ServiceResponse<QuoteRequestWithUserData[]>> {
    return api.get<QuoteRequestWithUserData[]>('/quotes/me');
}


'use client';
import type { Product, QuoteRequest, QuoteRequestWithUserData, SelectedConfiguration, ServiceResponse } from '../types';

interface QuoteRequestPayload {
  userId: string;
  product: Product;
  quantity: number;
  configuration: SelectedConfiguration;
  basePrice: number;
  userNotes?: string;
  file?: File;
}

export async function createQuoteRequest(
  payload: QuoteRequestPayload
): Promise<ServiceResponse<string>> {
  throw new Error('API not implemented: mockCreateQuoteRequest');
}

export async function updateUserQuoteStatus(
    quoteId: string,
    status: 'Accepted' | 'Rejected'
): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: mockUpdateUserQuoteStatus');
}

export async function getAllQuoteRequests(): Promise<ServiceResponse<QuoteRequestWithUserData[]>> {
  throw new Error('API not implemented: mockGetAllQuoteRequests');
}

export async function getUserQuotes(userId: string): Promise<ServiceResponse<QuoteRequestWithUserData[]>> {
    throw new Error('API not implemented: mockGetUserQuotes');
}

export async function submitQuote(
  quoteId: string,
  price: number,
  notes: string,
): Promise<ServiceResponse<void>> {
  throw new Error('API not implemented: mockSubmitQuote');
}

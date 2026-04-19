
'use client';
import type { Product, QuoteRequest, QuoteRequestWithUserData, SelectedConfiguration, ServiceResponse } from '../types';

interface QuoteRequestPayload {
  product: Product;
  quantity: number;
  configuration: SelectedConfiguration;
  basePrice: number;
  userNotes?: string;
  file?: File;
}

export async function createQuoteRequest(
  payload: QuoteRequestPayload
): Promise<ServiceResponse<QuoteRequestWithUserData>> {
  throw new Error('API not implemented: createQuoteRequest');
}

export async function updateUserQuoteStatus(
    quoteId: string,
    status: 'Accepted' | 'Rejected'
): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: updateUserQuoteStatus');
}

export async function getAllQuoteRequests(): Promise<ServiceResponse<QuoteRequestWithUserData[]>> {
  throw new Error('API not implemented: getAllQuoteRequests');
}

export async function getUserQuotes(): Promise<ServiceResponse<QuoteRequestWithUserData[]>> {
    throw new Error('API not implemented: getUserQuotes');
}

export async function submitQuote(
  quoteId: string,
  price: number,
  notes: string,
): Promise<ServiceResponse<void>> {
  throw new Error('API not implemented: submitQuote');
}

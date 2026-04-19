'use client';
import type { Product, QuoteRequestWithUserData, SelectedConfiguration, ServiceResponse, QuoteRequest } from '../types';

import {
    createQuoteRequest as mockCreateQuoteRequest,
    updateUserQuoteStatus as mockUpdateUserQuoteStatus,
    getAllQuoteRequests as mockGetAllQuoteRequests,
    submitQuote as mockSubmitQuote,
    getUserQuotes as mockGetUserQuotes,
} from '@/lib/mocks/quotes';

interface QuoteRequestPayload {
  userId: string;
  product: Product;
  quantity: number;
  configuration: SelectedConfiguration;
  basePrice: number;
  userNotes?: string;
  file?: File;
}

export async function createQuoteRequest(payload: QuoteRequestPayload): Promise<ServiceResponse<string>> {
  return mockCreateQuoteRequest(payload);
}

export async function updateUserQuoteStatus(
    quoteId: string,
    status: 'Accepted' | 'Rejected'
): Promise<ServiceResponse<void>> {
    return mockUpdateUserQuoteStatus(quoteId, status);
}

export async function getAllQuoteRequests(): Promise<ServiceResponse<QuoteRequestWithUserData[]>> {
  return mockGetAllQuoteRequests();
}

export async function submitQuote(
  quoteId: string,
  price: number,
  notes: string,
): Promise<ServiceResponse<void>> {
  return mockSubmitQuote(quoteId, price, notes);
}

export async function getUserQuotes(userId: string): Promise<ServiceResponse<QuoteRequest[]>> {
    return mockGetUserQuotes(userId);
}

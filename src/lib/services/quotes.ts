
import type { Product, QuoteRequestWithUserData, SelectedConfiguration, ServiceResponse } from '../types';
import { mockRawQuotes, mockUsers } from '@/lib/mock-data';
import { getMe } from './auth';

interface QuoteRequestPayload {
  product: Product;
  quantity: number;
  configuration: SelectedConfiguration;
  basePrice: number;
  userNotes?: string;
  file?: File;
}

let mockQuotes: QuoteRequestWithUserData[] = mockRawQuotes.map(quote => {
    const user = mockUsers.find(u => u.id === quote.userId);
    if (!user) throw new Error(`Mock data inconsistency: user not found for quote`);
    return {
      ...quote,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }
    };
});

export async function createQuoteRequest(
  payload: QuoteRequestPayload
): Promise<ServiceResponse<QuoteRequestWithUserData>> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const me = await getMe();
  const currentUser = mockUsers.find(u => u.id === me.data?.uid);
  if (!currentUser) {
    return { success: false, data: null, error: { message: "Mock user not found to create quote request" } };
  }

  const newQuote: QuoteRequestWithUserData = {
    id: `quote_${Math.random().toString(36).substring(2, 9)}`,
    userId: currentUser.id,
    items: [{
        id: `${payload.product.id}-quote-${Date.now()}`,
        productId: payload.product.id,
        name: payload.product.name,
        slug: payload.product.slug,
        image: payload.product.image,
        quantity: payload.quantity,
        price: payload.basePrice,
        configuration: payload.configuration,
    }],
    userNotes: payload.userNotes,
    status: 'Pending Review',
    createdAt: {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    },
    user: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      phoneNumber: currentUser.phoneNumber,
    }
  };

  mockQuotes.push(newQuote);

  return { success: true, data: newQuote, error: null };
}

export async function updateUserQuoteStatus(
    quoteId: string,
    status: 'Accepted' | 'Rejected'
): Promise<ServiceResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const quoteIndex = mockQuotes.findIndex(q => q.id === quoteId);
    if (quoteIndex > -1) {
        mockQuotes[quoteIndex].status = status;
        return { success: true, data: null, error: null };
    }
    return { success: false, data: null, error: { message: 'Quote not found' } };
}

export async function getAllQuoteRequests(): Promise<ServiceResponse<QuoteRequestWithUserData[]>> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return { success: true, data: mockQuotes, error: null };
}

export async function getUserQuotes(): Promise<ServiceResponse<QuoteRequestWithUserData[]>> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const me = await getMe();
    const userId = me.data?.uid;
    if (!userId) {
        return { success: false, data: null, error: { message: 'User not authenticated' }};
    }
    return { success: true, data: mockQuotes.filter(q => q.userId === userId), error: null };
}

export async function submitQuote(
  quoteId: string,
  price: number,
  notes: string,
): Promise<ServiceResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const quoteIndex = mockQuotes.findIndex(q => q.id === quoteId);
    if (quoteIndex > -1) {
        mockQuotes[quoteIndex].status = 'Quoted';
        mockQuotes[quoteIndex].quotedPrice = price;
        mockQuotes[quoteIndex].adminNotes = notes;
        mockQuotes[quoteIndex].quotedAt = {
            seconds: Math.floor(Date.now() / 1000),
            nanoseconds: 0,
        };
        return { success: true, data: null, error: null };
    }
    return { success: false, data: null, error: { message: 'Quote not found' } };
}

    
'use client';
import type { Product, SelectedConfiguration } from './types';
import { mockQuoteRequests } from './data';

interface QuoteRequestPayload {
  userId: string;
  product: Product;
  quantity: number;
  configuration: SelectedConfiguration;
  basePrice: number;
  userNotes?: string;
  file?: File;
}

// MOCK API - simulates a network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export async function createQuoteRequest(
  payload: QuoteRequestPayload
): Promise<string> {
  await sleep(1000);
  const { userId, product, quantity, configuration, basePrice, userNotes, file } = payload;
  
  const newQuoteId = `mock-quote-${Date.now()}`;

  const quoteItem = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || '',
      quantity: quantity,
      price: basePrice,
      configuration: configuration,
  };

  const quoteData: any = {
    id: newQuoteId,
    userId,
    items: [quoteItem],
    userNotes: userNotes || '',
    status: 'Pending Review',
    createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
    user: {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        phoneNumber: '01234567890',
    }
  };

   if (file) {
    console.log("Simulating file upload for quote:", file.name);
    quoteData.fileUrl = `/${file.name}`;
  }

  mockQuoteRequests.unshift(quoteData);
  
  console.log("Mock Quote Request Submitted:", quoteData);
  return newQuoteId;
}


export async function updateUserQuoteStatus(
    quoteId: string,
    status: 'Accepted' | 'Rejected'
): Promise<void> {
    await sleep(300);
    const quote = mockQuoteRequests.find(q => q.id === quoteId);
    if(quote) {
        quote.status = status;
    }
    console.log(`Mock API: Updated quote ${quoteId} status to ${status}`);
}

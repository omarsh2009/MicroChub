'use client';
import type { Product, QuoteRequestWithUserData, SelectedConfiguration } from '../types';
import { mockQuoteRequests, mockUsers } from './data';

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
      id: `cart-quote-${Date.now()}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image || '',
      quantity: quantity,
      price: basePrice,
      configuration: configuration,
  };

  const currentUser = mockUsers.find(u => u.id === userId);
  if (!currentUser) {
    throw new Error("User not found to create quote.");
  }


  const quoteData: any = {
    id: newQuoteId,
    userId,
    items: [quoteItem],
    userNotes: userNotes || '',
    status: 'Pending Review',
    createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
    user: {
        id: userId,
        name: currentUser.name,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
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

export async function getAllQuoteRequests(): Promise<QuoteRequestWithUserData[]> {
  await sleep(500);
  console.log("Mock API: Fetched all quote requests");
  return JSON.parse(JSON.stringify(mockQuoteRequests));
}

export async function submitQuote(
  quoteId: string,
  price: number,
  notes: string,
): Promise<void> {
  await sleep(300);
   const quote = mockQuoteRequests.find(q => q.id === quoteId);
    if(quote) {
        quote.status = 'Quoted';
        quote.quotedPrice = price;
        quote.adminNotes = notes;
    }
  console.log(`Mock API: Submitted quote for ${quoteId} with price ${price}`);
}

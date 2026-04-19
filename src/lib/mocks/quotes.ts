'use client';
import type { Product, QuoteRequest, QuoteRequestWithUserData, SelectedConfiguration, ServiceResponse } from '../types';
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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export async function createQuoteRequest(
  payload: QuoteRequestPayload
): Promise<ServiceResponse<string>> {
  await sleep(1000);
  try {
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
      return { data: null, error: "User not found.", status: 404 };
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
    return { data: newQuoteId, error: null, status: 201 };
  } catch(e: any) {
    return { data: null, error: e.message || 'Failed to create quote request.', status: 500 };
  }
}


export async function updateUserQuoteStatus(
    quoteId: string,
    status: 'Accepted' | 'Rejected'
): Promise<ServiceResponse<void>> {
    await sleep(300);
    const quote = mockQuoteRequests.find(q => q.id === quoteId);
    if(quote) {
        quote.status = status;
        console.log(`Mock API: Updated quote ${quoteId} status to ${status}`);
        return { data: null, error: null, status: 200 };
    }
    return { data: null, error: 'Quote not found', status: 404 };
}

export async function getAllQuoteRequests(): Promise<ServiceResponse<QuoteRequestWithUserData[]>> {
  await sleep(500);
  try {
    console.log("Mock API: Fetched all quote requests");
    return { data: JSON.parse(JSON.stringify(mockQuoteRequests)), error: null, status: 200 };
  } catch (e: any) {
    return { data: null, error: e.message || 'Failed to fetch quote requests.', status: 500 };
  }
}

export async function getUserQuotes(userId: string): Promise<ServiceResponse<QuoteRequest[]>> {
    await sleep(200);
    try {
        const userQuotes = mockQuoteRequests.filter(q => q.userId === userId);
        return { data: userQuotes, error: null, status: 200 };
    } catch(e: any) {
        return { data: null, error: e.message || 'Failed to fetch user quotes.', status: 500 };
    }
}

export async function submitQuote(
  quoteId: string,
  price: number,
  notes: string,
): Promise<ServiceResponse<void>> {
  await sleep(300);
   const quote = mockQuoteRequests.find(q => q.id === quoteId);
    if(quote) {
        quote.status = 'Quoted';
        quote.quotedPrice = price;
        quote.adminNotes = notes;
        console.log(`Mock API: Submitted quote for ${quoteId} with price ${price}`);
        return { data: null, error: null, status: 200 };
    }
    return { data: null, error: 'Quote not found', status: 404 };
}

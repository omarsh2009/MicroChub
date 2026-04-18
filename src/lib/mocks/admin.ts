'use client';

import { mockUsers, mockQuoteRequests, mockPaymentMethods } from './data';
import { getStoredOrders, setStoredOrders } from './orders';
import type { Order, UserProfile, OrderWithUserData, UserWithId, QuoteRequest, QuoteRequestWithUserData, PaymentMethod } from '../types';

// MOCK API - simulates a network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAllOrders(): Promise<OrderWithUserData[]> {
  await sleep(500);
  console.log("Mock API: Fetched all orders from localStorage");
  return getStoredOrders();
}

export async function getOrdersByUserId(userId: string): Promise<OrderWithUserData[]> {
  await sleep(500);
  console.log(`Mock API: Fetched orders for user ${userId} from localStorage`);
  const allOrders = getStoredOrders();
  const userOrders = allOrders.filter(o => o.userId === userId);
  return JSON.parse(JSON.stringify(userOrders));
}

export async function updateOrderStatus(
    orderId: string,
    status: Order['status']
): Promise<void> {
    await sleep(300);
    const orders = getStoredOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if(orderIndex !== -1) {
        orders[orderIndex].status = status;
        setStoredOrders(orders);
    }
    console.log(`Mock API: Updated order ${orderId} status to ${status} in localStorage`);
}

export async function approveLegalAgreement(
    orderId: string
): Promise<void> {
    await sleep(300);
    const orders = getStoredOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if(orderIndex !== -1) {
        orders[orderIndex].legalAgreementApproved = true;
        setStoredOrders(orders);
    }
    console.log(`Mock API: Approved legal agreement for order ${orderId} in localStorage`);
}

// USER MANAGEMENT
export async function getAllUsers(): Promise<UserWithId[]> {
    await sleep(500);
    console.log("Mock API: Fetched all users");
    return JSON.parse(JSON.stringify(mockUsers));
}

export async function getUserById(userId: string): Promise<UserWithId | undefined> {
    await sleep(200);
    console.log(`Mock API: Fetched user ${userId}`);
    const user = mockUsers.find(u => u.id === userId);
    return user ? JSON.parse(JSON.stringify(user)) : undefined;
}


export async function updateUserRole(
    userId: string,
    role: UserProfile['role']
): Promise<void> {
    await sleep(300);
    const user = mockUsers.find(u => u.id === userId);
    if(user) {
        user.role = role;
    }
    console.log(`Mock API: Updated user ${userId} role to ${role}`);
}

// QUOTE MANAGEMENT
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

// PAYMENT METHODS
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  await sleep(200);
  console.log("Mock API: Fetched payment methods");
  return JSON.parse(JSON.stringify(mockPaymentMethods));
}

export async function addPaymentMethod(data: Omit<PaymentMethod, 'id'>): Promise<string> {
    await sleep(300);
    const newId = `pm-${Date.now()}`;
    const newMethod = { id: newId, ...data };
    mockPaymentMethods.push(newMethod);
    console.log("Mock API: Added new payment method", newMethod);
    return newId;
}

export async function updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<void> {
  await sleep(300);
  const index = mockPaymentMethods.findIndex(m => m.id === id);
  if (index !== -1) {
    mockPaymentMethods[index] = { ...mockPaymentMethods[index], ...data };
    console.log("Mock API: Updated payment method", mockPaymentMethods[index]);
  }
}

export async function deletePaymentMethod(id: string): Promise<void> {
    await sleep(300);
    const index = mockPaymentMethods.findIndex(m => m.id === id);
    if(index > -1) {
        mockPaymentMethods.splice(index, 1);
    }
    console.log(`Mock API: Deleted payment method ${id}`);
}

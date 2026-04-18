'use client';
import type { CartItem, PaymentMethod, ShippingAddress } from './types';
import { mockOrders } from './data';

interface OrderPayload {
  userId: string;
  cart: CartItem[];
  totalPrice: number;
  notes?: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  transactionId: string;
  requiresLegalApproval: boolean;
  legalAgreementFile?: File;
}

// MOCK API - simulates a network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function createOrder(
  payload: OrderPayload
): Promise<string> {
  await sleep(1000);
  
  const { 
    userId, 
    cart, 
    totalPrice, 
    notes, 
    shippingAddress, 
    paymentMethod,
    transactionId,
    requiresLegalApproval, 
    legalAgreementFile 
  } = payload;
  
  if (requiresLegalApproval && !legalAgreementFile) {
    throw new Error("A signed legal agreement is required for restricted items.");
  }

  const newOrderId = `mock-order-${Date.now()}`;
  
  const orderData = {
    id: newOrderId,
    userId,
    items: cart,
    totalPrice,
    notes: notes || '',
    shippingAddress,
    paymentMethod: {
      id: paymentMethod.id,
      name: paymentMethod.name,
    },
    transactionId,
    requiresLegalApproval,
    legalAgreementApproved: false,
    status: 'Pending Verification',
    createdAt: { 
        seconds: Math.floor(Date.now() / 1000), 
        nanoseconds: 0 
    },
    user: {
        id: userId,
        name: shippingAddress.fullName,
        email: 'test@example.com', // In real app, get from user object
        phoneNumber: shippingAddress.phoneNumber,
    }
  };

  if (legalAgreementFile) {
    // In a real app, this would be uploaded and the URL stored.
    console.log("Simulating file upload for:", legalAgreementFile.name);
    (orderData as any).legalAgreementUrl = `/${legalAgreementFile.name}`;
  }
  
  // Add to our in-memory mock data array
  mockOrders.unshift(orderData);

  console.log("Mock Order Submitted:", orderData);
  return newOrderId;
}

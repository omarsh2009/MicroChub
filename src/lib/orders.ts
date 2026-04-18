'use client';
import { getInitialMockOrders } from './data';
import type { CartItem, OrderWithUserData, PaymentMethod, ShippingAddress } from './types';

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
  couponCode?: string;
  discountAmount?: number;
}

const ORDERS_STORAGE_KEY = 'microchub-orders';
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function getStoredOrders(): OrderWithUserData[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!stored) {
        const initialOrders = getInitialMockOrders();
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initialOrders));
        return initialOrders;
    }
    return JSON.parse(stored);
}

export function setStoredOrders(orders: OrderWithUserData[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

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
  
  const orderData: OrderWithUserData = {
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
    console.log("Simulating file upload for:", legalAgreementFile.name);
    orderData.legalAgreementUrl = `/${legalAgreementFile.name}`;
  }
  
  const allOrders = getStoredOrders();
  allOrders.unshift(orderData);
  setStoredOrders(allOrders);

  console.log("Mock Order Submitted and stored in localStorage:", orderData);
  return newOrderId;
}

export async function getUserOrders(userId: string): Promise<OrderWithUserData[]> {
  await sleep(200);
  const orders = getStoredOrders();
  return orders.filter(o => o.userId === userId);
}

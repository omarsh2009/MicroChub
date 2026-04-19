
'use client';
import type { Order, OrderWithUserData, CartItem, PaymentMethod, ShippingAddress, ServiceResponse } from '../types';
import { api } from '@/lib/api';

interface OrderPayload {
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

export async function createOrder(payload: OrderPayload): Promise<ServiceResponse<{orderId: string}>> {
  // This is a placeholder. The actual implementation would handle multipart/form-data
  // for file uploads, which requires a more complex setup than the basic api wrapper provides.
  if (payload.legalAgreementFile) {
    console.warn("File upload in createOrder is not fully implemented in the frontend service layer and requires a multipart/form-data fetch call.");
  }
  
  return api.post<{orderId: string}>('/orders', payload);
}

export async function getUserOrders(): Promise<ServiceResponse<OrderWithUserData[]>> {
  return api.get<OrderWithUserData[]>('/orders/me');
}

export async function getAllOrders(): Promise<ServiceResponse<OrderWithUserData[]>> {
  return api.get<OrderWithUserData[]>('/orders');
}

export async function updateOrderStatus(
    orderId: string,
    status: Order['status']
): Promise<ServiceResponse<void>> {
    return api.patch<void>(`/orders/${orderId}/status`, { status });
}

export async function approveLegalAgreement(
    orderId: string
): Promise<ServiceResponse<void>> {
    return api.patch<void>(`/orders/${orderId}/legal-agreement`, { approved: true });
}

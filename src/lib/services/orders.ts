
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
  // File uploads require multipart/form-data, which our basic api wrapper doesn't handle.
  // This would need a more advanced implementation in a real app.
  if (payload.legalAgreementFile) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'legalAgreementFile') {
        formData.append(key, value as File);
      } else if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    // This fetch call is made directly because it uses FormData
    // return api.post('/orders', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    console.warn("File upload in createOrder is not implemented in the base api wrapper.");
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

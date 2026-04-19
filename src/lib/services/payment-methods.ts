
'use client';
import type { PaymentMethod, ServiceResponse } from '../types';
import { api } from '@/lib/api';

export async function getPaymentMethods(onlyEnabled = false): Promise<ServiceResponse<PaymentMethod[]>> {
  return api.get<PaymentMethod[]>(`/payment-methods${onlyEnabled ? '?enabled=true' : ''}`);
}

export async function addPaymentMethod(data: Omit<PaymentMethod, 'id'>): Promise<ServiceResponse<PaymentMethod>> {
    return api.post<PaymentMethod>('/payment-methods', data);
}

export async function updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<ServiceResponse<PaymentMethod>> {
  return api.put<PaymentMethod>(`/payment-methods/${id}`, data);
}

export async function deletePaymentMethod(id: string): Promise<ServiceResponse<void>> {
    return api.delete<void>(`/payment-methods/${id}`);
}

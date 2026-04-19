
'use client';
import type { PaymentMethod, ServiceResponse } from '../types';

export async function getPaymentMethods(): Promise<ServiceResponse<PaymentMethod[]>> {
  throw new Error('API not implemented: mockGetPaymentMethods');
}

export async function addPaymentMethod(data: Omit<PaymentMethod, 'id'>): Promise<ServiceResponse<string>> {
    throw new Error('API not implemented: mockAddPaymentMethod');
}

export async function updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<ServiceResponse<void>> {
  throw new Error('API not implemented: mockUpdatePaymentMethod');
}

export async function deletePaymentMethod(id: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: mockDeletePaymentMethod');
}

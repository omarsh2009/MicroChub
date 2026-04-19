'use client';
import type { PaymentMethod, ServiceResponse } from '../types';
import {
    getPaymentMethods as mockGetPaymentMethods,
    addPaymentMethod as mockAddPaymentMethod,
    updatePaymentMethod as mockUpdatePaymentMethod,
    deletePaymentMethod as mockDeletePaymentMethod,
} from '@/lib/mocks/payment-methods';

export async function getPaymentMethods(): Promise<ServiceResponse<PaymentMethod[]>> {
  return mockGetPaymentMethods();
}

export async function addPaymentMethod(data: Omit<PaymentMethod, 'id'>): Promise<ServiceResponse<string>> {
    return mockAddPaymentMethod(data);
}

export async function updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<ServiceResponse<void>> {
  return mockUpdatePaymentMethod(id, data);
}

export async function deletePaymentMethod(id: string): Promise<ServiceResponse<void>> {
    return mockDeletePaymentMethod(id);
}

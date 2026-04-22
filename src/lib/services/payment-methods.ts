
import type { PaymentMethod, ServiceResponse } from '../types';
import { mockPaymentMethods } from '@/lib/mock-data';

export async function getPaymentMethods(onlyEnabled = false): Promise<ServiceResponse<PaymentMethod[]>> {
    if (onlyEnabled) {
        return { success: true, data: mockPaymentMethods.filter(m => m.enabled), error: null };
    }
    return { success: true, data: mockPaymentMethods, error: null };
}

export async function addPaymentMethod(data: Omit<PaymentMethod, 'id'>): Promise<ServiceResponse<PaymentMethod>> {
    const newMethod: PaymentMethod = {
        ...data,
        id: `pm_${Math.random().toString(36).substring(2, 9)}`,
    };
    mockPaymentMethods.push(newMethod);
    return { success: true, data: newMethod, error: null };
}

export async function updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<ServiceResponse<PaymentMethod>> {
  const methodIndex = mockPaymentMethods.findIndex(m => m.id === id);
  if (methodIndex === -1) {
    return { success: false, data: null, error: { message: 'Payment method not found.' } };
  }
  const updatedMethod = { ...mockPaymentMethods[methodIndex], ...data };
  mockPaymentMethods[methodIndex] = updatedMethod;
  return { success: true, data: updatedMethod, error: null };
}

export async function deletePaymentMethod(id: string): Promise<ServiceResponse<void>> {
    const methodIndex = mockPaymentMethods.findIndex(m => m.id === id);
    if (methodIndex > -1) {
        mockPaymentMethods.splice(methodIndex, 1);
    }
    return { success: true, data: null, error: null };
}

    
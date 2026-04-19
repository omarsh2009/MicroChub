'use client';
import { mockPaymentMethods } from './data';
import type { PaymentMethod, ServiceResponse } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getPaymentMethods(): Promise<ServiceResponse<PaymentMethod[]>> {
  await sleep(200);
  try {
    console.log("Mock API: Fetched payment methods");
    return { data: JSON.parse(JSON.stringify(mockPaymentMethods)), error: null, status: 200 };
  } catch (e: any) {
    return { data: null, error: e.message || 'Failed to fetch payment methods.', status: 500 };
  }
}

export async function addPaymentMethod(data: Omit<PaymentMethod, 'id'>): Promise<ServiceResponse<string>> {
    await sleep(300);
    try {
        const newId = `pm-${Date.now()}`;
        const newMethod = { id: newId, ...data };
        mockPaymentMethods.push(newMethod);
        console.log("Mock API: Added new payment method", newMethod);
        return { data: newId, error: null, status: 201 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to add payment method.', status: 500 };
    }
}

export async function updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<ServiceResponse<void>> {
  await sleep(300);
  try {
    const index = mockPaymentMethods.findIndex(m => m.id === id);
    if (index !== -1) {
      mockPaymentMethods[index] = { ...mockPaymentMethods[index], ...data };
      console.log("Mock API: Updated payment method", mockPaymentMethods[index]);
      return { data: null, error: null, status: 200 };
    }
    return { data: null, error: 'Payment method not found.', status: 404 };
  } catch (e: any) {
    return { data: null, error: e.message || 'Failed to update payment method.', status: 500 };
  }
}

export async function deletePaymentMethod(id: string): Promise<ServiceResponse<void>> {
    await sleep(300);
    try {
        const index = mockPaymentMethods.findIndex(m => m.id === id);
        if(index > -1) {
            mockPaymentMethods.splice(index, 1);
        }
        console.log(`Mock API: Deleted payment method ${id}`);
        return { data: null, error: null, status: 200 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to delete payment method.', status: 500 };
    }
}

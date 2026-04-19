'use client';
import { mockPaymentMethods } from './data';
import type { PaymentMethod } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

'use client';
import { mockPaymentMethods } from './data';
import type { PaymentMethod, ServiceResponse } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const PAYMENT_METHODS_STORAGE_KEY = 'microchub-payment-methods';

function getStoredPaymentMethods(): PaymentMethod[] {
    if (typeof window === 'undefined') return mockPaymentMethods;
    const stored = localStorage.getItem(PAYMENT_METHODS_STORAGE_KEY);
    if (!stored || JSON.parse(stored).length === 0) {
        setStoredPaymentMethods(mockPaymentMethods);
        return mockPaymentMethods;
    }
    return JSON.parse(stored);
}

function setStoredPaymentMethods(methods: PaymentMethod[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PAYMENT_METHODS_STORAGE_KEY, JSON.stringify(methods));
}

export async function getPaymentMethods(): Promise<ServiceResponse<PaymentMethod[]>> {
  await sleep(200);
  try {
    const methods = getStoredPaymentMethods();
    console.log("Mock API: Fetched payment methods from localStorage");
    return { data: methods, error: null, status: 200 };
  } catch (e: any) {
    return { data: null, error: e.message || 'Failed to fetch payment methods.', status: 500 };
  }
}

export async function addPaymentMethod(data: Omit<PaymentMethod, 'id'>): Promise<ServiceResponse<string>> {
    await sleep(300);
    try {
        const methods = getStoredPaymentMethods();
        const newId = `pm-${Date.now()}`;
        const newMethod = { id: newId, ...data };
        methods.push(newMethod);
        setStoredPaymentMethods(methods);
        console.log("Mock API: Added new payment method", newMethod);
        return { data: newId, error: null, status: 201 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to add payment method.', status: 500 };
    }
}

export async function updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<ServiceResponse<void>> {
  await sleep(300);
  try {
    const methods = getStoredPaymentMethods();
    const index = methods.findIndex(m => m.id === id);
    if (index !== -1) {
      methods[index] = { ...methods[index], ...data };
      setStoredPaymentMethods(methods);
      console.log("Mock API: Updated payment method", methods[index]);
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
        let methods = getStoredPaymentMethods();
        methods = methods.filter(m => m.id !== id);
        setStoredPaymentMethods(methods);
        console.log(`Mock API: Deleted payment method ${id}`);
        return { data: null, error: null, status: 200 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to delete payment method.', status: 500 };
    }
}


'use client';
import type { PaymentMethod, ServiceResponse } from '../types';
import { api } from '@/lib/api';

export async function getPaymentMethods(onlyEnabled = false): Promise<ServiceResponse<PaymentMethod[]>> {
    throw new Error('API not implemented: getPaymentMethods');
}

export async function addPaymentMethod(data: Omit<PaymentMethod, 'id'>): Promise<ServiceResponse<PaymentMethod>> {
    throw new Error('API not implemented: addPaymentMethod');
}

export async function updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<ServiceResponse<PaymentMethod>> {
    throw new Error('API not implemented: updatePaymentMethod');
}

export async function deletePaymentMethod(id: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: deletePaymentMethod');
}

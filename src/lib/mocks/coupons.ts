
'use client';
import type { Coupon, ServiceResponse } from '../types';

export async function getCoupons(): Promise<ServiceResponse<Coupon[]>> {
    throw new Error('API not implemented: getCoupons');
}

export async function addCoupon(data: Omit<Coupon, 'id' | 'usedCount'>): Promise<ServiceResponse<Coupon>> {
    throw new Error('API not implemented: addCoupon');
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<ServiceResponse<Coupon>> {
    throw new Error('API not implemented: updateCoupon');
}

export async function deleteCoupon(id: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: deleteCoupon');
}

export async function validateCoupon(code: string): Promise<ServiceResponse<Coupon>> {
    throw new Error('API not implemented: validateCoupon');
}

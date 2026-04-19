
'use client';
import type { Coupon, ServiceResponse } from '../types';

export async function getCoupons(): Promise<ServiceResponse<Coupon[]>> {
    throw new Error('API not implemented: mockGetCoupons');
}

export async function addCoupon(data: Omit<Coupon, 'id' | 'usedCount'>): Promise<ServiceResponse<string>> {
    throw new Error('API not implemented: mockAddCoupon');
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: mockUpdateCoupon');
}

export async function deleteCoupon(id: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: mockDeleteCoupon');
}

export async function validateCoupon(code: string): Promise<ServiceResponse<Coupon>> {
    throw new Error('API not implemented: mockValidateCoupon');
}

export async function incrementCouponUsage(code: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: mockIncrementCouponUsage');
}

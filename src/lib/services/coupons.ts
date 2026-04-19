'use client';
import type { Coupon, ServiceResponse } from '../types';

import {
    getCoupons as mockGetCoupons,
    addCoupon as mockAddCoupon,
    updateCoupon as mockUpdateCoupon,
    deleteCoupon as mockDeleteCoupon,
    validateCoupon as mockValidateCoupon,
    incrementCouponUsage as mockIncrementCouponUsage,
} from '@/lib/mocks/coupons';

export async function getCoupons(): Promise<ServiceResponse<Coupon[]>> {
    return mockGetCoupons();
}

export async function addCoupon(data: Omit<Coupon, 'id' | 'usedCount'>): Promise<ServiceResponse<string>> {
    return mockAddCoupon(data);
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<ServiceResponse<void>> {
    return mockUpdateCoupon(id, data);
}

export async function deleteCoupon(id: string): Promise<ServiceResponse<void>> {
    return mockDeleteCoupon(id);
}

export async function validateCoupon(code: string): Promise<ServiceResponse<Coupon>> {
    return mockValidateCoupon(code);
}

export async function incrementCouponUsage(code: string): Promise<ServiceResponse<void>> {
    return mockIncrementCouponUsage(code);
}

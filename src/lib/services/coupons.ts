
'use client';
import type { Coupon, ServiceResponse } from '../types';
import { mockCoupons } from '@/lib/mock-data';

let usedCoupons: Record<string, number> = {};
mockCoupons.forEach(c => {
    usedCoupons[c.id] = c.usedCount;
})


export async function getCoupons(): Promise<ServiceResponse<Coupon[]>> {
    const data = mockCoupons.map(c => ({...c, usedCount: usedCoupons[c.id] || 0 }));
    return { success: true, data, error: null };
}

export async function addCoupon(data: Omit<Coupon, 'id' | 'usedCount'>): Promise<ServiceResponse<Coupon>> {
    const newCoupon: Coupon = {
        ...data,
        id: `coup_${Math.random().toString(36).substring(2, 9)}`,
        usedCount: 0,
    };
    mockCoupons.push(newCoupon);
    usedCoupons[newCoupon.id] = 0;
    return { success: true, data: newCoupon, error: null };
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<ServiceResponse<Coupon>> {
    const couponIndex = mockCoupons.findIndex(c => c.id === id);
    if (couponIndex === -1) {
        return { success: false, data: null, error: { message: 'Coupon not found' }};
    }
    const updatedCoupon = { ...mockCoupons[couponIndex], ...data };
    mockCoupons[couponIndex] = updatedCoupon;
    return { success: true, data: updatedCoupon, error: null };
}

export async function deleteCoupon(id: string): Promise<ServiceResponse<void>> {
    const couponIndex = mockCoupons.findIndex(c => c.id === id);
    if (couponIndex > -1) {
        mockCoupons.splice(couponIndex, 1);
        delete usedCoupons[id];
    }
    return { success: true, data: null, error: null };
}

export async function validateCoupon(code: string): Promise<ServiceResponse<Coupon>> {
    const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
        return { success: false, data: null, error: { message: 'Invalid coupon code.' }};
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
         return { success: false, data: null, error: { message: 'This coupon has expired.' }};
    }
    const usedCount = usedCoupons[coupon.id] || 0;
    if (coupon.maxUses && usedCount >= coupon.maxUses) {
         return { success: false, data: null, error: { message: 'This coupon has reached its usage limit.' }};
    }

    return { success: true, data: {...coupon, usedCount }, error: null };
}

// Function to simulate using a coupon, e.g., on order completion
export function applyCoupon(code: string) {
    const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
        usedCoupons[coupon.id] = (usedCoupons[coupon.id] || 0) + 1;
    }
}

    
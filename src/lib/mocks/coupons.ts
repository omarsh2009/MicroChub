'use client';
import { mockCoupons } from './data';
import type { Coupon, ServiceResponse } from '../types';

// MOCK API - simulates localStorage for coupons
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const COUPONS_STORAGE_KEY = 'microchub-coupons';

function getStoredCoupons(): Coupon[] {
    if (typeof window === 'undefined') return mockCoupons;
    const stored = localStorage.getItem(COUPONS_STORAGE_KEY);
    // Initialize with mock data if nothing is in localStorage
    if (!stored || JSON.parse(stored).length === 0) {
        setStoredCoupons(mockCoupons);
        return mockCoupons;
    }
    return JSON.parse(stored);
}

function setStoredCoupons(coupons: Coupon[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
}

export async function getCoupons(): Promise<ServiceResponse<Coupon[]>> {
    await sleep(300);
    try {
        const coupons = getStoredCoupons();
        return { data: coupons, error: null, status: 200 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to fetch coupons.', status: 500 };
    }
}

export async function addCoupon(data: Omit<Coupon, 'id' | 'usedCount'>): Promise<ServiceResponse<string>> {
    await sleep(300);
    try {
        const coupons = getStoredCoupons();
        const newId = `coupon-${Date.now()}`;
        const newCoupon: Coupon = { id: newId, ...data, usedCount: 0 };
        const updatedCoupons = [...coupons, newCoupon];
        setStoredCoupons(updatedCoupons);
        console.log("Mock API: Added new coupon", newCoupon);
        return { data: newId, error: null, status: 201 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to add coupon.', status: 500 };
    }
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<ServiceResponse<void>> {
    await sleep(300);
    try {
        const coupons = getStoredCoupons();
        const index = coupons.findIndex(c => c.id === id);
        if (index !== -1) {
            coupons[index] = { ...coupons[index], ...data };
            setStoredCoupons(coupons);
            console.log("Mock API: Updated coupon", coupons[index]);
            return { data: null, error: null, status: 200 };
        }
        return { data: null, error: 'Coupon not found.', status: 404 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to update coupon.', status: 500 };
    }
}

export async function deleteCoupon(id: string): Promise<ServiceResponse<void>> {
    await sleep(300);
    try {
        const coupons = getStoredCoupons();
        const updatedCoupons = coupons.filter(c => c.id !== id);
        setStoredCoupons(updatedCoupons);
        console.log(`Mock API: Deleted coupon ${id}`);
        return { data: null, error: null, status: 200 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to delete coupon.', status: 500 };
    }
}

export async function validateCoupon(code: string): Promise<ServiceResponse<Coupon>> {
    await sleep(400);
    try {
        const coupons = getStoredCoupons();
        const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());

        if (!coupon) {
            return { data: null, error: 'Invalid coupon code.', status: 404 };
        }
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return { data: null, error: 'This coupon has expired.', status: 410 };
        }
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return { data: null, error: 'This coupon has reached its usage limit.', status: 409 };
        }

        return { data: coupon, error: null, status: 200 };
    } catch(e: any) {
        return { data: null, error: e.message || 'Failed to validate coupon.', status: 500 };
    }
}

export async function incrementCouponUsage(code: string): Promise<ServiceResponse<void>> {
    await sleep(100);
    try {
        const coupons = getStoredCoupons();
        const index = coupons.findIndex(c => c.code.toUpperCase() === code.toUpperCase());
        if (index !== -1) {
            coupons[index].usedCount++;
            setStoredCoupons(coupons);
            console.log(`Mock API: Incremented usage for coupon ${code}`);
            return { data: null, error: null, status: 200 };
        }
        return { data: null, error: 'Coupon not found.', status: 404 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to increment coupon usage.', status: 500 };
    }
}

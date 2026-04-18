'use client';
import { mockCoupons } from './data';
import type { Coupon } from '../types';

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

export async function getCoupons(): Promise<Coupon[]> {
    await sleep(300);
    return getStoredCoupons();
}

export async function addCoupon(data: Omit<Coupon, 'id' | 'usedCount'>): Promise<string> {
    await sleep(300);
    const coupons = getStoredCoupons();
    const newId = `coupon-${Date.now()}`;
    const newCoupon: Coupon = { id: newId, ...data, usedCount: 0 };
    const updatedCoupons = [...coupons, newCoupon];
    setStoredCoupons(updatedCoupons);
    console.log("Mock API: Added new coupon", newCoupon);
    return newId;
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<void> {
    await sleep(300);
    const coupons = getStoredCoupons();
    const index = coupons.findIndex(c => c.id === id);
    if (index !== -1) {
        coupons[index] = { ...coupons[index], ...data };
        setStoredCoupons(coupons);
        console.log("Mock API: Updated coupon", coupons[index]);
    }
}

export async function deleteCoupon(id: string): Promise<void> {
    await sleep(300);
    const coupons = getStoredCoupons();
    const updatedCoupons = coupons.filter(c => c.id !== id);
    setStoredCoupons(updatedCoupons);
    console.log(`Mock API: Deleted coupon ${id}`);
}

export async function validateCoupon(code: string): Promise<Coupon | { error: string }> {
    await sleep(400);
    const coupons = getStoredCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
        return { error: 'Invalid coupon code.' };
    }
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return { error: 'This coupon has expired.' };
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return { error: 'This coupon has reached its usage limit.' };
    }

    return coupon;
}

export async function incrementCouponUsage(code: string): Promise<void> {
    await sleep(100);
    const coupons = getStoredCoupons();
    const index = coupons.findIndex(c => c.code.toUpperCase() === code.toUpperCase());
    if (index !== -1) {
        coupons[index].usedCount++;
        setStoredCoupons(coupons);
    }
    console.log(`Mock API: Incremented usage for coupon ${code}`);
}


import type { Coupon, ServiceResponse } from '../types';
import { api } from '@/lib/api';

export async function getCoupons(): Promise<ServiceResponse<Coupon[]>> {
    return api.get<Coupon[]>('/coupons');
}

export async function addCoupon(data: Omit<Coupon, 'id' | 'usedCount'>): Promise<ServiceResponse<Coupon>> {
    return api.post<Coupon>('/coupons', data);
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<ServiceResponse<Coupon>> {
    return api.put<Coupon>(`/coupons/${id}`, data);
}

export async function deleteCoupon(id: string): Promise<ServiceResponse<void>> {
    return api.delete<void>(`/coupons/${id}`);
}

export async function validateCoupon(code: string): Promise<ServiceResponse<Coupon>> {
    return api.post<Coupon>('/coupons/apply', { code });
}

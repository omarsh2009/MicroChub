
'use client';
import type { WishlistItem, ServiceResponse } from '../types';
import { api } from '@/lib/api';

export async function getWishlist(): Promise<ServiceResponse<WishlistItem[]>> {
    return api.get<WishlistItem[]>('/wishlist');
}

export async function addToWishlist(productId: string): Promise<ServiceResponse<WishlistItem>> {
    return api.post<WishlistItem>('/wishlist', { productId });
}

export async function removeFromWishlist(productId: string): Promise<ServiceResponse<void>> {
    return api.delete<void>(`/wishlist/${productId}`);
}

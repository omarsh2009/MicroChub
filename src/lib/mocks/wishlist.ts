
'use client';
import type { WishlistItem, ServiceResponse } from '../types';

export async function getWishlist(): Promise<ServiceResponse<WishlistItem[]>> {
    throw new Error('API not implemented: getWishlist');
}

export async function addToWishlist(productId: string): Promise<ServiceResponse<WishlistItem>> {
    throw new Error('API not implemented: addToWishlist');
}

export async function removeFromWishlist(productId: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: removeFromWishlist');
}

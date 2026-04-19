
'use client';
import type { WishlistItem, ServiceResponse } from '../types';

export async function getWishlist(userId: string): Promise<ServiceResponse<WishlistItem[]>> {
    throw new Error('API not implemented: mockGetWishlist');
}

export async function addToWishlist(userId: string, productId: string): Promise<ServiceResponse<WishlistItem>> {
    throw new Error('API not implemented: mockAddToWishlist');
}

export async function removeFromWishlist(userId: string, productId: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: mockRemoveFromWishlist');
}

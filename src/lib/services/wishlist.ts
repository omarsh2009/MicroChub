'use client';
import type { WishlistItem, ServiceResponse } from '../types';

import {
    getWishlist as mockGetWishlist,
    addToWishlist as mockAddToWishlist,
    removeFromWishlist as mockRemoveFromWishlist
} from '@/lib/mocks/wishlist';


export async function getWishlist(userId: string): Promise<ServiceResponse<WishlistItem[]>> {
    return mockGetWishlist(userId);
}

export async function addToWishlist(userId: string, productId: string): Promise<ServiceResponse<WishlistItem>> {
    return mockAddToWishlist(userId, productId);
}

export async function removeFromWishlist(userId: string, productId: string): Promise<ServiceResponse<void>> {
    return mockRemoveFromWishlist(userId, productId);
}

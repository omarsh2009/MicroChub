
'use client';
import type { WishlistItem, ServiceResponse } from '../types';
import { getMe } from './auth';
import { mockUsers } from '@/lib/mock-data';

// This function directly manipulates the mockUsers array to simulate wishlist changes.

async function getWishlistForCurrentUser(): Promise<string[]> {
    const me = await getMe();
    const userId = me.data?.uid;
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.wishlist : [];
}

export async function getWishlist(): Promise<ServiceResponse<WishlistItem[]>> {
    const me = await getMe();
    const userId = me.data?.uid;
    if (!userId) return { success: false, data: null, error: { message: 'User not authenticated' }};

    const productIds = await getWishlistForCurrentUser();
    const wishlistItems: WishlistItem[] = productIds.map(productId => ({
        id: `${userId}-${productId}`,
        userId,
        productId,
        addedAt: Date.now() // Mock timestamp
    }));
    return { success: true, data: wishlistItems, error: null };
}

export async function addToWishlist(productId: string): Promise<ServiceResponse<WishlistItem>> {
    const me = await getMe();
    const userId = me.data?.uid;
    if (!userId) return { success: false, data: null, error: { message: 'User not authenticated' }};

    const user = mockUsers.find(u => u.id === userId);
    if (user && !user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
    }
    
    const newItem: WishlistItem = {
        id: `${userId}-${productId}`,
        userId,
        productId,
        addedAt: Date.now()
    };
    
    return { success: true, data: newItem, error: null };
}

export async function removeFromWishlist(productId: string): Promise<ServiceResponse<void>> {
    const me = await getMe();
    const userId = me.data?.uid;
    if (!userId) return { success: false, data: null, error: { message: 'User not authenticated' }};
    
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
        const index = user.wishlist.indexOf(productId);
        if (index > -1) {
            user.wishlist.splice(index, 1);
        }
    }
    
    return { success: true, data: null, error: null };
}

    
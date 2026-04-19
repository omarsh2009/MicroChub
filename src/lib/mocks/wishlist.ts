'use client';
import type { WishlistItem, ServiceResponse } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const WISHLIST_KEY_PREFIX = 'microchub-wishlist';

function getWishlistKey(userId: string) {
    return `${WISHLIST_KEY_PREFIX}-${userId}`;
}

function getStoredWishlist(userId: string): WishlistItem[] {
    if (typeof window === 'undefined') return [];
    const key = getWishlistKey(userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

function setStoredWishlist(userId: string, wishlist: WishlistItem[]) {
    if (typeof window === 'undefined') return;
    const key = getWishlistKey(userId);
    localStorage.setItem(key, JSON.stringify(wishlist));
}

export async function getWishlist(userId: string): Promise<ServiceResponse<WishlistItem[]>> {
    await sleep(100);
    try {
        const wishlist = getStoredWishlist(userId);
        return { data: wishlist, error: null, status: 200 };
    } catch(e: any) {
        return { data: null, error: e.message || 'Failed to fetch wishlist', status: 500 };
    }
}

export async function addToWishlist(userId: string, productId: string): Promise<ServiceResponse<WishlistItem>> {
    await sleep(200);
    try {
        const wishlist = getStoredWishlist(userId);
        if (wishlist.some(item => item.productId === productId)) {
            return { data: null, error: "Item already in wishlist.", status: 409 };
        }
        const newItem: WishlistItem = {
            id: productId,
            productId,
            userId,
            addedAt: Date.now(),
        };
        const updatedWishlist = [...wishlist, newItem];
        setStoredWishlist(userId, updatedWishlist);
        return { data: newItem, error: null, status: 201 };
    } catch(e: any) {
        return { data: null, error: e.message || 'Failed to add item to wishlist', status: 500 };
    }
}

export async function removeFromWishlist(userId: string, productId: string): Promise<ServiceResponse<void>> {
    await sleep(200);
    try {
        const wishlist = getStoredWishlist(userId);
        const updatedWishlist = wishlist.filter(item => item.productId !== productId);
        setStoredWishlist(userId, updatedWishlist);
        return { data: null, error: null, status: 200 };
    } catch (e: any) {
        return { data: null, error: e.message || 'Failed to remove item from wishlist', status: 500 };
    }
}

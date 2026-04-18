'use client';
import type { WishlistItem } from '../types';

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

export async function getWishlist(userId: string): Promise<WishlistItem[]> {
    await sleep(100);
    return getStoredWishlist(userId);
}

export async function addToWishlist(userId: string, productId: string): Promise<WishlistItem> {
    await sleep(200);
    const wishlist = getStoredWishlist(userId);
    if (wishlist.some(item => item.productId === productId)) {
        throw new Error("Item already in wishlist.");
    }
    const newItem: WishlistItem = {
        id: productId,
        productId,
        userId,
        addedAt: Date.now(),
    };
    const updatedWishlist = [...wishlist, newItem];
    setStoredWishlist(userId, updatedWishlist);
    return newItem;
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
    await sleep(200);
    const wishlist = getStoredWishlist(userId);
    const updatedWishlist = wishlist.filter(item => item.productId !== productId);
    setStoredWishlist(userId, updatedWishlist);
}

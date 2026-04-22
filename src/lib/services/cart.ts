
'use client';
import type { CartItem, Product, SelectedConfiguration, ServiceResponse } from '../types';
import { getMe } from './auth';

// In-memory cart store, keyed by user ID
const userCarts: Record<string, CartItem[]> = {
    'user-super-admin': [],
    'user-admin': [],
    'user-regular': [],
    'user-new': [],
};

async function getCartForCurrentUser(): Promise<CartItem[]> {
    const me = await getMe();
    const userId = me.data?.uid;
    if (!userId || !userCarts[userId]) {
        return [];
    }
    return userCarts[userId];
}


export async function getCart(): Promise<ServiceResponse<CartItem[]>> {
    const cart = await getCartForCurrentUser();
    return { success: true, data: [...cart], error: null };
}

export async function addToCart(
    product: Product,
    quantity: number,
    configuration: SelectedConfiguration,
    price: number
): Promise<ServiceResponse<CartItem[]>> {
    const me = await getMe();
    const userId = me.data?.uid;
    if (!userId) {
        return { success: false, data: null, error: { message: 'User not authenticated' }};
    }
    if (!userCarts[userId]) userCarts[userId] = [];
    
    const cart = userCarts[userId];
    
    const configHash = Buffer.from(JSON.stringify(configuration || {})).toString('hex').slice(0, 8);
    const cartItemId = `${product.id}-${configHash}`;
    
    const existingItemIndex = cart.findIndex(item => item.id === cartItemId);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: cartItemId,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: product.image,
            quantity,
            price,
            configuration,
        });
    }

    return { success: true, data: [...cart], error: null };
}

export async function removeFromCart(itemId: string): Promise<ServiceResponse<CartItem[]>> {
    const me = await getMe();
    const userId = me.data?.uid;
    if (!userId || !userCarts[userId]) {
        return { success: false, data: null, error: { message: 'Cart not found' }};
    }
    
    userCarts[userId] = userCarts[userId].filter(item => item.id !== itemId);
    
    return { success: true, data: [...userCarts[userId]], error: null };
}

export async function updateItemQuantity(itemId: string, newQuantity: number): Promise<ServiceResponse<CartItem[]>> {
    const me = await getMe();
    const userId = me.data?.uid;
    if (!userId || !userCarts[userId]) {
        return { success: false, data: null, error: { message: 'Cart not found' }};
    }

    const itemIndex = userCarts[userId].findIndex(item => item.id === itemId);

    if (itemIndex > -1) {
        if (newQuantity > 0) {
            userCarts[userId][itemIndex].quantity = newQuantity;
        } else {
            userCarts[userId].splice(itemIndex, 1);
        }
    }
    
    return { success: true, data: [...userCarts[userId]], error: null };
}

export async function clearCart(): Promise<ServiceResponse<void>> {
    const me = await getMe();
    const userId = me.data?.uid;
    if (!userId) {
        return { success: false, data: null, error: { message: 'User not authenticated' }};
    }
    userCarts[userId] = [];
    return { success: true, data: null, error: null };
}

    
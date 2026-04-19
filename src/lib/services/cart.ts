'use client';
import type { CartItem, Product, SelectedConfiguration, ServiceResponse } from '../types';

import {
    getCart as mockGetCart,
    addToCart as mockAddToCart,
    removeFromCart as mockRemoveFromCart,
    updateItemQuantity as mockUpdateItemQuantity,
    clearCart as mockClearCart
} from '@/lib/mocks/cart';


export async function getCart(userId: string): Promise<ServiceResponse<CartItem[]>> {
    return mockGetCart(userId);
}

export async function addToCart(
    userId: string,
    product: Product,
    quantity: number,
    configuration: SelectedConfiguration,
    price: number
): Promise<ServiceResponse<CartItem[]>> {
    return mockAddToCart(userId, product, quantity, configuration, price);
}

export async function removeFromCart(userId: string, itemId: string): Promise<ServiceResponse<CartItem[]>> {
    return mockRemoveFromCart(userId, itemId);
}

export async function updateItemQuantity(userId: string, itemId: string, newQuantity: number): Promise<ServiceResponse<CartItem[]>> {
    return mockUpdateItemQuantity(userId, itemId, newQuantity);
}

export async function clearCart(userId: string): Promise<ServiceResponse<void>> {
    return mockClearCart(userId);
}

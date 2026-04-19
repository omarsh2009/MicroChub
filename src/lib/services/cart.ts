
'use client';
import type { CartItem, Product, SelectedConfiguration, ServiceResponse } from '../types';
import { api } from '@/lib/api';

export async function getCart(): Promise<ServiceResponse<CartItem[]>> {
    return api.get<CartItem[]>('/cart');
}

export async function addToCart(
    product: Product,
    quantity: number,
    configuration: SelectedConfiguration,
    price: number
): Promise<ServiceResponse<CartItem[]>> {
    const payload = {
        productId: product.id,
        quantity,
        configuration,
        price
    };
    return api.post<CartItem[]>('/cart/items', payload);
}

export async function removeFromCart(itemId: string): Promise<ServiceResponse<CartItem[]>> {
    return api.delete<CartItem[]>(`/cart/items/${itemId}`);
}

export async function updateItemQuantity(itemId: string, newQuantity: number): Promise<ServiceResponse<CartItem[]>> {
    return api.patch<CartItem[]>(`/cart/items/${itemId}`, { quantity: newQuantity });
}

export async function clearCart(): Promise<ServiceResponse<void>> {
    return api.delete<void>('/cart');
}

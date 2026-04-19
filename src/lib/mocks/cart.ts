
'use client';
import type { CartItem, Product, SelectedConfiguration, ServiceResponse } from '../types';

export async function getCart(userId: string): Promise<ServiceResponse<CartItem[]>> {
    throw new Error('API not implemented: mockGetCart');
}

export async function addToCart(
    userId: string,
    product: Product,
    quantity: number,
    configuration: SelectedConfiguration,
    price: number
): Promise<ServiceResponse<CartItem[]>> {
    throw new Error('API not implemented: mockAddToCart');
}

export async function removeFromCart(userId: string, itemId: string): Promise<ServiceResponse<CartItem[]>> {
    throw new Error('API not implemented: mockRemoveFromCart');
}

export async function updateItemQuantity(userId: string, itemId: string, newQuantity: number): Promise<ServiceResponse<CartItem[]>> {
    throw new Error('API not implemented: mockUpdateItemQuantity');
}

export async function clearCart(userId: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: mockClearCart');
}

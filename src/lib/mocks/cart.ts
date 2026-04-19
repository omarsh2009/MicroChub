
'use client';
import type { CartItem, Product, SelectedConfiguration, ServiceResponse } from '../types';

export async function getCart(): Promise<ServiceResponse<CartItem[]>> {
    throw new Error('API not implemented: getCart');
}

export async function addToCart(
    product: Product,
    quantity: number,
    configuration: SelectedConfiguration,
    price: number
): Promise<ServiceResponse<CartItem[]>> {
    throw new Error('API not implemented: addToCart');
}

export async function removeFromCart(itemId: string): Promise<ServiceResponse<CartItem[]>> {
    throw new Error('API not implemented: removeFromCart');
}

export async function updateItemQuantity(itemId: string, newQuantity: number): Promise<ServiceResponse<CartItem[]>> {
    throw new Error('API not implemented: updateItemQuantity');
}

export async function clearCart(): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: clearCart');
}

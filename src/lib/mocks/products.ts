
'use client';
import type { Product, ServiceResponse } from '../types';

export async function getProducts(categorySlug?: string): Promise<ServiceResponse<Product[]>> {
    throw new Error('API not implemented: getProducts');
}

export async function getFeaturedProducts(): Promise<ServiceResponse<Product[]>> {
    throw new Error('API not implemented: getFeaturedProducts');
}

export async function getProductBySlug(slug: string): Promise<ServiceResponse<Product | undefined>> {
    throw new Error('API not implemented: getProductBySlug');
}

export async function addProduct(productData: Omit<Product, 'id' | 'slug'>): Promise<ServiceResponse<Product>> {
    throw new Error('API not implemented: addProduct');
}

export async function updateProduct(productId: string, productData: Partial<Product>): Promise<ServiceResponse<Product>> {
    throw new Error('API not implemented: updateProduct');
}

export async function deleteProduct(productId: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: deleteProduct');
}


import type { Product, ServiceResponse } from '../types';
import { api } from '@/lib/api';

export async function getProducts(categorySlug?: string): Promise<ServiceResponse<Product[]>> {
    const endpoint = categorySlug ? `/products?category=${categorySlug}` : '/products';
    return api.get<Product[]>(endpoint);
}

export async function getFeaturedProducts(): Promise<ServiceResponse<Product[]>> {
    return api.get<Product[]>('/products/featured');
}

export async function getProductBySlug(slug: string): Promise<ServiceResponse<Product | undefined>> {
    return api.get<Product | undefined>(`/products/${slug}`);
}

export async function addProduct(productData: Omit<Product, 'id' | 'slug'>): Promise<ServiceResponse<Product>> {
    return api.post<Product>('/products', productData);
}

export async function updateProduct(productId: string, productData: Partial<Product>): Promise<ServiceResponse<Product>> {
    return api.put<Product>(`/products/${productId}`, productData);
}

export async function deleteProduct(productId: string): Promise<ServiceResponse<void>> {
    return api.delete<void>(`/products/${productId}`);
}

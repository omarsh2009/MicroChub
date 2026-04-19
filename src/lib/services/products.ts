import type { Product, ServiceResponse } from '../types';

import {
    getProducts as mockGetProducts,
    getFeaturedProducts as mockGetFeaturedProducts,
    getProductBySlug as mockGetProductBySlug,
    addProduct as mockAddProduct,
    updateProduct as mockUpdateProduct,
    deleteProduct as mockDeleteProduct,
} from '@/lib/mocks/products';

export async function getProducts(): Promise<ServiceResponse<Product[]>> {
    return mockGetProducts();
}

export async function getFeaturedProducts(): Promise<ServiceResponse<Product[]>> {
    return mockGetFeaturedProducts();
}

export async function getProductBySlug(slug: string): Promise<ServiceResponse<Product | undefined>> {
    return mockGetProductBySlug(slug);
}

export async function addProduct(productData: Omit<Product, 'id' | 'slug'>): Promise<ServiceResponse<Product>> {
    return mockAddProduct(productData);
}

export async function updateProduct(productId: string, productData: Partial<Product>): Promise<ServiceResponse<Product>> {
    return mockUpdateProduct(productId, productData);
}

export async function deleteProduct(productId: string): Promise<ServiceResponse<void>> {
    return mockDeleteProduct(productId);
}

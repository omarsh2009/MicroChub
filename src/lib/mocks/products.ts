
import type { Product, ServiceResponse } from '../types';

export async function getProducts(): Promise<ServiceResponse<Product[]>> {
    throw new Error('API not implemented: mockGetProducts');
}

export async function getFeaturedProducts(): Promise<ServiceResponse<Product[]>> {
    throw new Error('API not implemented: mockGetFeaturedProducts');
}

export async function getProductBySlug(slug: string): Promise<ServiceResponse<Product | undefined>> {
    throw new Error('API not implemented: mockGetProductBySlug');
}

export async function addProduct(productData: Omit<Product, 'id' | 'slug'>): Promise<ServiceResponse<Product>> {
    throw new Error('API not implemented: mockAddProduct');
}

export async function updateProduct(productId: string, productData: Partial<Product>): Promise<ServiceResponse<Product>> {
    throw new Error('API not implemented: mockUpdateProduct');
}

export async function deleteProduct(productId: string): Promise<ServiceResponse<void>> {
    throw new Error('API not implemented: mockDeleteProduct');
}

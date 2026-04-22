
import type { Product, ServiceResponse } from '../types';
import { api } from '@/lib/api';
import { mockProducts, mockCategories } from '@/lib/mock-data';

export async function getProducts(categorySlug?: string): Promise<ServiceResponse<Product[]>> {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay

    if (categorySlug) {
        const category = mockCategories.find(c => c.slug === categorySlug);
        if (category) {
            const filteredProducts = mockProducts.filter(p => p.categoryIds.includes(category.id));
            return { success: true, data: filteredProducts, error: null };
        }
        return { success: true, data: [], error: null };
    }
    
    return { success: true, data: mockProducts, error: null };
}

export async function getFeaturedProducts(): Promise<ServiceResponse<Product[]>> {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
    const featured = mockProducts.filter(p => p.featured);
    return { success: true, data: featured, error: null };
}

export async function getProductBySlug(slug: string): Promise<ServiceResponse<Product | undefined>> {
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
    const product = mockProducts.find(p => p.slug === slug);
    if (product) {
        return { success: true, data: product, error: null };
    }
    return { success: false, data: undefined, error: { message: 'Product not found' } };
}

export async function addProduct(productData: Omit<Product, 'id' | 'slug'>): Promise<ServiceResponse<Product>> {
    // This would interact with a real API
    console.log('Adding product:', productData);
    return api.post<Product>('/products', productData);
}

export async function updateProduct(productId: string, productData: Partial<Product>): Promise<ServiceResponse<Product>> {
    // This would interact with a real API
    console.log('Updating product:', productId, productData);
    return api.put<Product>(`/products/${productId}`, productData);
}

export async function deleteProduct(productId: string): Promise<ServiceResponse<void>> {
    // This would interact with a real API
    console.log('Deleting product:', productId);
    return api.delete<void>(`/products/${productId}`);
}

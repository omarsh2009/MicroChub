import type { Product, ServiceResponse } from '../types';

import {
    getProducts as mockGetProducts,
    getFeaturedProducts as mockGetFeaturedProducts,
    getProductBySlug as mockGetProductBySlug,
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

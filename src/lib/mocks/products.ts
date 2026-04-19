import { products as mockProducts, featuredProducts as mockFeaturedProducts } from './data';
import type { Product, ServiceResponse } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProducts(): Promise<ServiceResponse<Product[]>> {
    await sleep(100);
    return { data: mockProducts, error: null, status: 200 };
}

export async function getFeaturedProducts(): Promise<ServiceResponse<Product[]>> {
    await sleep(100);
    return { data: mockFeaturedProducts, error: null, status: 200 };
}

export async function getProductBySlug(slug: string): Promise<ServiceResponse<Product | undefined>> {
    await sleep(100);
    const product = mockProducts.find(p => p.slug === slug);
    if (product) {
        return { data: product, error: null, status: 200 };
    }
    return { data: null, error: 'Product not found.', status: 404 };
}

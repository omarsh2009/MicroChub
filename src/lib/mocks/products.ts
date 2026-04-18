import { products, featuredProducts, mockCategories } from './data';
import type { Product, Category } from '../types';

export async function getProducts(): Promise<Product[]> {
    return Promise.resolve(products);
}

export async function getFeaturedProducts(): Promise<Product[]> {
    return Promise.resolve(featuredProducts);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    return Promise.resolve(products.find(p => p.slug === slug));
}

export async function getCategoriesForProduct(product: Product): Promise<Category[]> {
    const categories = mockCategories.filter(c => product.categoryIds.includes(c.id));
    return Promise.resolve(categories);
}

import { mockProducts } from './data';
import type { Product, ServiceResponse } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const PRODUCTS_STORAGE_KEY = 'microchub-products';

function getStoredProducts(): Product[] {
    if (typeof window === 'undefined') return mockProducts;
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!stored || JSON.parse(stored).length === 0) {
        setStoredProducts(mockProducts);
        return mockProducts;
    }
    return JSON.parse(stored);
}

function setStoredProducts(products: Product[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}


export async function getProducts(): Promise<ServiceResponse<Product[]>> {
    await sleep(100);
    try {
        const products = getStoredProducts();
        return { data: products, error: null, status: 200 };
    } catch(e: any) {
        return { data: null, error: 'Failed to fetch products', status: 500 };
    }
}

export async function getFeaturedProducts(): Promise<ServiceResponse<Product[]>> {
    await sleep(100);
    try {
        const products = getStoredProducts();
        const featured = products.filter(p => p.featured);
        return { data: featured, error: null, status: 200 };
    } catch(e: any) {
        return { data: [], error: 'Failed to fetch featured products', status: 500 };
    }
}

export async function getProductBySlug(slug: string): Promise<ServiceResponse<Product | undefined>> {
    await sleep(100);
    try {
        const products = getStoredProducts();
        const product = products.find(p => p.slug === slug);
        if (product) {
            return { data: product, error: null, status: 200 };
        }
        return { data: undefined, error: 'Product not found.', status: 404 };
    } catch(e: any) {
        return { data: undefined, error: 'Failed to fetch product', status: 500 };
    }
}

export async function addProduct(productData: Omit<Product, 'id' | 'slug'>): Promise<ServiceResponse<Product>> {
    await sleep(300);
    try {
        const products = getStoredProducts();
        const slug = productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        
        const newProduct: Product = {
            ...productData,
            id: `prod-${Date.now()}`,
            slug: `${slug}-${Math.random().toString(36).substr(2, 5)}`, // ensure unique slug
        };

        const updatedProducts = [...products, newProduct];
        setStoredProducts(updatedProducts);
        return { data: newProduct, error: null, status: 201 };
    } catch(e: any) {
        return { data: null, error: 'Failed to add product', status: 500 };
    }
}

export async function updateProduct(productId: string, productData: Partial<Product>): Promise<ServiceResponse<Product>> {
    await sleep(300);
    try {
        const products = getStoredProducts();
        const index = products.findIndex(p => p.id === productId);

        if (index === -1) {
            return { data: null, error: 'Product not found', status: 404 };
        }
        
        // create a new slug if name changes
        const newSlug = productData.name ? productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : products[index].slug;

        const updatedProduct = { 
            ...products[index], 
            ...productData,
            slug: newSlug,
        };
        
        products[index] = updatedProduct;
        setStoredProducts(products);
        return { data: updatedProduct, error: null, status: 200 };
    } catch(e: any) {
        return { data: null, error: 'Failed to update product', status: 500 };
    }
}


export async function deleteProduct(productId: string): Promise<ServiceResponse<void>> {
    await sleep(300);
    try {
        const products = getStoredProducts();
        const updatedProducts = products.filter(p => p.id !== productId);
        setStoredProducts(updatedProducts);
        return { data: null, error: null, status: 204 };
    } catch(e: any) {
        return { data: null, error: 'Failed to delete product', status: 500 };
    }
}

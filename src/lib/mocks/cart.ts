'use client';
import type { CartItem, Product, SelectedConfiguration, ServiceResponse } from '../types';

const CART_KEY_PREFIX = 'microchub-cart';

function getCartKey(userId: string) {
    return `${CART_KEY_PREFIX}-${userId}`;
}

async function getStoredCart(userId: string): Promise<CartItem[]> {
    if (typeof window === 'undefined') return [];
    const key = getCartKey(userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

async function saveStoredCart(userId: string, cart: CartItem[]): Promise<void> {
    if (typeof window === 'undefined') return;
    const key = getCartKey(userId);
    localStorage.setItem(key, JSON.stringify(cart));
}

export async function getCart(userId: string): Promise<ServiceResponse<CartItem[]>> {
    try {
        const cart = await getStoredCart(userId);
        return { data: cart, error: null, status: 200 };
    } catch(e: any) {
        return { data: null, error: e.message || 'Failed to get cart.', status: 500 };
    }
}

export async function addToCart(
    userId: string,
    product: Product,
    quantity: number,
    configuration: SelectedConfiguration,
    price: number
): Promise<ServiceResponse<CartItem[]>> {
    try {
        const configString = JSON.stringify(
            Object.keys(configuration)
              .sort()
              .reduce((obj: Record<string, any>, key) => {
                obj[key] = configuration[key];
                return obj;
              }, {})
          );
          const cartItemId = `${product.id}-${btoa(configString)}`;

          const currentCart = await getStoredCart(userId);
          const existingItem = currentCart.find((item) => item.id === cartItemId);

          let newCart: CartItem[];

          if (existingItem) {
            newCart = currentCart.map((item) =>
              item.id === cartItemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const newItem: CartItem = {
              id: cartItemId,
              productId: product.id,
              name: product.name,
              slug: product.slug,
              image: product.image || '',
              quantity,
              price,
              configuration,
            };
            newCart = [...currentCart, newItem];
          }

          await saveStoredCart(userId, newCart);
          return { data: newCart, error: null, status: 200 };
    } catch(e: any) {
        return { data: null, error: e.message || 'Failed to add item to cart.', status: 500 };
    }
}

export async function removeFromCart(userId: string, itemId: string): Promise<ServiceResponse<CartItem[]>> {
    try {
        const currentCart = await getStoredCart(userId);
        const newCart = currentCart.filter((item) => item.id !== itemId);
        await saveStoredCart(userId, newCart);
        return { data: newCart, error: null, status: 200 };
    } catch(e: any) {
        return { data: null, error: e.message || 'Failed to remove item from cart.', status: 500 };
    }
}

export async function updateItemQuantity(userId: string, itemId: string, newQuantity: number): Promise<ServiceResponse<CartItem[]>> {
    try {
        const currentCart = await getStoredCart(userId);
        let newCart;
        if (newQuantity < 1) {
            newCart = currentCart.filter((item) => item.id !== itemId);
        } else {
            newCart = currentCart.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
        }
        await saveStoredCart(userId, newCart);
        return { data: newCart, error: null, status: 200 };
    } catch(e: any) {
        return { data: null, error: e.message || 'Failed to update item quantity.', status: 500 };
    }
}

export async function clearCart(userId: string): Promise<ServiceResponse<void>> {
    try {
        await saveStoredCart(userId, []);
        return { data: null, error: null, status: 200 };
    } catch(e: any) {
        return { data: null, error: e.message || 'Failed to clear cart.', status: 500 };
    }
}

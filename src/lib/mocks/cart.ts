'use client';
import type { CartItem, Product, SelectedConfiguration } from '../types';

const CART_KEY_PREFIX = 'microchub-cart';

function getCartKey(userId: string) {
    return `${CART_KEY_PREFIX}-${userId}`;
}

export async function getCart(userId: string): Promise<CartItem[]> {
    if (typeof window === 'undefined') return [];
    const key = getCartKey(userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

async function saveCart(userId: string, cart: CartItem[]): Promise<void> {
    if (typeof window === 'undefined') return;
    const key = getCartKey(userId);
    localStorage.setItem(key, JSON.stringify(cart));
}

export async function addToCart(
    userId: string,
    product: Product,
    quantity: number,
    configuration: SelectedConfiguration,
    price: number
): Promise<CartItem[]> {
    const configString = JSON.stringify(
        Object.keys(configuration)
          .sort()
          .reduce((obj: Record<string, any>, key) => {
            obj[key] = configuration[key];
            return obj;
          }, {})
      );
      const cartItemId = `${product.id}-${btoa(configString)}`;

      const currentCart = await getCart(userId);
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

      await saveCart(userId, newCart);
      return newCart;
}

export async function removeFromCart(userId: string, itemId: string): Promise<CartItem[]> {
    const currentCart = await getCart(userId);
    const newCart = currentCart.filter((item) => item.id !== itemId);
    await saveCart(userId, newCart);
    return newCart;
}

export async function updateItemQuantity(userId: string, itemId: string, newQuantity: number): Promise<CartItem[]> {
    const currentCart = await getCart(userId);
    let newCart;
    if (newQuantity < 1) {
        newCart = currentCart.filter((item) => item.id !== itemId);
    } else {
        newCart = currentCart.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
    }
    await saveCart(userId, newCart);
    return newCart;
}

export async function clearCart(userId: string): Promise<void> {
    await saveCart(userId, []);
}

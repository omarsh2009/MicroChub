'use client';
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import type { CartItem, Product, SelectedConfiguration } from '@/lib/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    configuration: SelectedConfiguration,
    price: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = 'microchub-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      setCart([]);
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(newCart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  };

  const addToCart = useCallback(
    (
      product: Product,
      quantity: number,
      configuration: SelectedConfiguration,
      price: number
    ) => {
      const configString = JSON.stringify(
        Object.keys(configuration)
          .sort()
          .reduce((obj: Record<string, any>, key) => {
            obj[key] = configuration[key];
            return obj;
          }, {})
      );
      const cartItemId = `${product.id}-${btoa(configString)}`;

      const currentCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]') as CartItem[];
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
          price, // This is the price per unit
          configuration,
        };
        newCart = [...currentCart, newItem];
      }

      updateCart(newCart);
      toast({
        title: 'Added to Cart',
        description: `${quantity} x ${product.name} was added.`,
      });
    },
    [toast]
  );

  const removeFromCart = useCallback((itemId: string) => {
    const currentCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]') as CartItem[];
    const newCart = currentCart.filter((item) => item.id !== itemId);
    updateCart(newCart);
    toast({
      variant: 'default',
      title: 'Item Removed',
      description: 'The item has been removed from your cart.',
    });
  }, [toast]);

  const updateItemQuantity = useCallback(
    (itemId: string, newQuantity: number) => {
      const currentCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]') as CartItem[];
      let newCart;
      if (newQuantity < 1) {
        newCart = currentCart.filter((item) => item.id !== itemId);
         toast({
          variant: 'default',
          title: 'Item Removed',
          description: 'The item has been removed from your cart.',
        });
      } else {
        newCart = currentCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
      }
      updateCart(newCart);
    },
    [toast]
  );
  
  const clearCart = useCallback(() => {
    updateCart([]);
  }, []);

  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    itemCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

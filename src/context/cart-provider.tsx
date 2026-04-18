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
import { useUser } from '@/auth';

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

const CART_KEY_PREFIX = 'microchub-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const user = useUser();

  const getCartKey = useCallback(() => {
    return user ? `${CART_KEY_PREFIX}-${user.uid}` : null;
  }, [user]);

  useEffect(() => {
    const cartKey = getCartKey();
    if (!cartKey) {
      setCart([]);
      return;
    };

    try {
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      setCart([]);
    }
  }, [getCartKey]);

  const updateCart = (newCart: CartItem[]) => {
    const cartKey = getCartKey();
    if (!cartKey) return;
    
    setCart(newCart);
    try {
      localStorage.setItem(cartKey, JSON.stringify(newCart));
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
      const cartKey = getCartKey();
      if (!cartKey) {
          toast({ variant: 'destructive', title: 'Please log in to add items to your cart.'});
          return;
      }
      
      const configString = JSON.stringify(
        Object.keys(configuration)
          .sort()
          .reduce((obj: Record<string, any>, key) => {
            obj[key] = configuration[key];
            return obj;
          }, {})
      );
      const cartItemId = `${product.id}-${btoa(configString)}`;

      const currentCart = JSON.parse(localStorage.getItem(cartKey) || '[]') as CartItem[];
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
    [toast, getCartKey]
  );

  const removeFromCart = useCallback((itemId: string) => {
    const cartKey = getCartKey();
    if (!cartKey) return;
    const currentCart = JSON.parse(localStorage.getItem(cartKey) || '[]') as CartItem[];
    const newCart = currentCart.filter((item) => item.id !== itemId);
    updateCart(newCart);
    toast({
      variant: 'default',
      title: 'Item Removed',
      description: 'The item has been removed from your cart.',
    });
  }, [toast, getCartKey]);

  const updateItemQuantity = useCallback(
    (itemId: string, newQuantity: number) => {
       const cartKey = getCartKey();
       if (!cartKey) return;
      const currentCart = JSON.parse(localStorage.getItem(cartKey) || '[]') as CartItem[];
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
    [toast, getCartKey]
  );
  
  const clearCart = useCallback(() => {
    updateCart([]);
  }, [getCartKey]);

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

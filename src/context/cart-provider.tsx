'use client';
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import type { CartItem, Product, SelectedConfiguration } from '@/lib/types';
import { useUser } from '@/auth';
import * as cartService from '@/lib/services/cart';

interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (
    product: Product,
    quantity: number,
    configuration: SelectedConfiguration,
    price: number
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const user = useUser();

  useEffect(() => {
    async function loadCart() {
      if (user) {
        setIsLoading(true);
        try {
          const userCart = await cartService.getCart(user.uid);
          setCart(userCart);
        } catch (e) {
          console.error('Failed to load cart', e);
          setCart([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setCart([]);
        setIsLoading(false);
      }
    }
    loadCart();
  }, [user]);

  const addToCart = useCallback(
    async (
      product: Product,
      quantity: number,
      configuration: SelectedConfiguration,
      price: number
    ) => {
      if (!user) {
        toast({ variant: 'destructive', title: 'Please log in to add items to your cart.' });
        return;
      }
      try {
        const newCart = await cartService.addToCart(user.uid, product, quantity, configuration, price);
        setCart(newCart);
        toast({
          title: 'Added to Cart',
          description: `${quantity} x ${product.name} was added.`,
        });
      } catch (e) {
        console.error('Failed to add to cart', e);
        toast({ variant: 'destructive', title: 'Could not add to cart.' });
      }
    },
    [user, toast]
  );

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!user) return;
    try {
        const newCart = await cartService.removeFromCart(user.uid, itemId);
        setCart(newCart);
        toast({
            variant: 'default',
            title: 'Item Removed',
            description: 'The item has been removed from your cart.',
        });
    } catch (e) {
        console.error('Failed to remove from cart', e);
        toast({ variant: 'destructive', title: 'Could not remove item.' });
    }
  }, [user, toast]);

  const updateItemQuantity = useCallback(
    async (itemId: string, newQuantity: number) => {
      if (!user) return;
      try {
        const newCart = await cartService.updateItemQuantity(user.uid, itemId, newQuantity);
        setCart(newCart);
        if (newQuantity < 1) {
            toast({
                variant: 'default',
                title: 'Item Removed',
                description: 'The item has been removed from your cart.',
            });
        }
      } catch (e) {
        console.error('Failed to update quantity', e);
        toast({ variant: 'destructive', title: 'Could not update quantity.' });
      }
    },
    [user, toast]
  );
  
  const clearCart = useCallback(async () => {
    if (!user) return;
    try {
        await cartService.clearCart(user.uid);
        setCart([]);
    } catch(e) {
        console.error('Failed to clear cart', e);
        toast({ variant: 'destructive', title: 'Could not clear cart.' });
    }
  }, [user, toast]);

  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const value = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    itemCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}


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
        const { data, error } = await cartService.getCart();
        if (error) {
          console.error('Failed to load cart', error.message);
          setCart([]);
        } else {
          setCart(data || []);
        }
        setIsLoading(false);
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
      const { data, error } = await cartService.addToCart(product, quantity, configuration, price);
      if (error) {
        console.error('Failed to add to cart', error.message);
        toast({ variant: 'destructive', title: 'Could not add to cart.' });
      } else {
        setCart(data || []);
        toast({
          title: 'Added to Cart',
          description: `${quantity} x ${product.name} was added.`,
        });
      }
    },
    [user, toast]
  );

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!user) return;
    const { data, error } = await cartService.removeFromCart(itemId);
    if (error) {
      console.error('Failed to remove from cart', error.message);
      toast({ variant: 'destructive', title: 'Could not remove item.' });
    } else {
      setCart(data || []);
      toast({
          variant: 'default',
          title: 'Item Removed',
          description: 'The item has been removed from your cart.',
      });
    }
  }, [user, toast]);

  const updateItemQuantity = useCallback(
    async (itemId: string, newQuantity: number) => {
      if (!user) return;
      const { data, error } = await cartService.updateItemQuantity(itemId, newQuantity);
      if (error) {
        console.error('Failed to update quantity', error.message);
        toast({ variant: 'destructive', title: 'Could not update quantity.' });
      } else {
        setCart(data || []);
        if (newQuantity < 1) {
            toast({
                variant: 'default',
                title: 'Item Removed',
                description: 'The item has been removed from your cart.',
            });
        }
      }
    },
    [user, toast]
  );
  
  const clearCart = useCallback(async () => {
    if (!user) return;
    const { error } = await cartService.clearCart();
    if (error) {
      console.error('Failed to clear cart', error.message);
      toast({ variant: 'destructive', title: 'Could not clear cart.' });
    } else {
      setCart([]);
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

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
import { placeholderImagesById } from '@/lib/data';

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
  itemCount: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('microchub-cart');
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
    localStorage.setItem('microchub-cart', JSON.stringify(newCart));
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

      const existingItem = cart.find((item) => item.id === cartItemId);
      const primaryImageId = product.images[0];
      const placeholderImage = placeholderImagesById[primaryImageId];

      let newCart: CartItem[];

      if (existingItem) {
        newCart = cart.map((item) =>
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
          image: placeholderImage?.imageUrl || '',
          quantity,
          price, // This is the price per unit
          configuration,
        };
        newCart = [...cart, newItem];
      }

      updateCart(newCart);
      toast({
        title: 'Added to Cart',
        description: `${quantity} x ${product.name} was added.`,
      });
    },
    [cart, toast]
  );

  const removeFromCart = useCallback((itemId: string) => {
    const newCart = cart.filter((item) => item.id !== itemId);
    updateCart(newCart);
    toast({
      variant: 'default',
      title: 'Item Removed',
      description: 'The item has been removed from your cart.',
    });
  }, [cart, toast]);

  const updateItemQuantity = useCallback(
    (itemId: string, newQuantity: number) => {
      let newCart;
      if (newQuantity < 1) {
        newCart = cart.filter((item) => item.id !== itemId);
         toast({
          variant: 'default',
          title: 'Item Removed',
          description: 'The item has been removed from your cart.',
        });
      } else {
        newCart = cart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
      }
      updateCart(newCart);
    },
    [cart, toast]
  );
  
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    itemCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

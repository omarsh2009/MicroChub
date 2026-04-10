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
import { useUser } from '@/firebase';

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

const GUEST_CART_KEY = 'microchub-cart-guest';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const user = useUser();

  const cartKey = useMemo(() => {
    return user ? `microchub-cart-${user.uid}` : GUEST_CART_KEY;
  }, [user]);

  // Effect to load cart from localStorage when user/cartKey changes
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]); // Clear cart if no stored cart found for the current key
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      setCart([]);
    }
  }, [cartKey]);

  // Effect to handle merging guest cart to user cart on login
  useEffect(() => {
    if (user) {
      try {
        const guestCartJSON = localStorage.getItem(GUEST_CART_KEY);
        if (guestCartJSON) {
          const guestCart: CartItem[] = JSON.parse(guestCartJSON);
          if (guestCart.length > 0) {
            const userCartJSON = localStorage.getItem(cartKey);
            const userCart: CartItem[] = userCartJSON ? JSON.parse(userCartJSON) : [];
            
            // Simple merge: add all guest items to user cart, handling duplicates
            const mergedCart = [...userCart];
            guestCart.forEach(guestItem => {
              const existingItemIndex = mergedCart.findIndex(userItem => userItem.id === guestItem.id);
              if (existingItemIndex !== -1) {
                // Item exists, update quantity
                mergedCart[existingItemIndex].quantity += guestItem.quantity;
              } else {
                // New item, add to cart
                mergedCart.push(guestItem);
              }
            });

            setCart(mergedCart);
            localStorage.setItem(cartKey, JSON.stringify(mergedCart));
            localStorage.removeItem(GUEST_CART_KEY);
            toast({ title: 'Cart Merged', description: 'Your guest cart has been merged with your account.' });
          }
        }
      } catch (e) {
        console.error('Failed to merge carts on login', e);
      }
    }
  }, [user, cartKey, toast]);


  const updateCart = (newCart: CartItem[]) => {
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
      
      const primaryImageId = product.images[0];
      const placeholderImage = placeholderImagesById[primaryImageId];

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
          image: placeholderImage?.imageUrl || '',
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
    [cartKey, toast]
  );

  const removeFromCart = useCallback((itemId: string) => {
    const currentCart = JSON.parse(localStorage.getItem(cartKey) || '[]') as CartItem[];
    const newCart = currentCart.filter((item) => item.id !== itemId);
    updateCart(newCart);
    toast({
      variant: 'default',
      title: 'Item Removed',
      description: 'The item has been removed from your cart.',
    });
  }, [cartKey, toast]);

  const updateItemQuantity = useCallback(
    (itemId: string, newQuantity: number) => {
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
    [cartKey, toast]
  );
  
  const clearCart = useCallback(() => {
    updateCart([]);
  }, [cartKey]);

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

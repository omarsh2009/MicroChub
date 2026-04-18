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
import { useUser } from '@/auth';

export interface WishlistItem {
    id: string; // Will be the productId for simplicity in mock
    productId: string;
    userId: string;
    addedAt: number; // Use a timestamp
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | null>(null);

const WISHLIST_KEY = 'microchub-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const user = useUser();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Use a user-specific key for localStorage
  const userWishlistKey = useMemo(() => user ? `${WISHLIST_KEY}-${user.uid}` : WISHLIST_KEY, [user]);

  useEffect(() => {
    setLoading(true);
    try {
      const storedWishlist = localStorage.getItem(userWishlistKey);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [userWishlistKey]);

  const updateWishlist = (newWishlist: WishlistItem[]) => {
    setWishlist(newWishlist);
    try {
      localStorage.setItem(userWishlistKey, JSON.stringify(newWishlist));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage", error);
    }
  };

  const addToWishlist = useCallback(async (productId: string) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in.' });
        return;
    }
    
    if (wishlist.some(item => item.productId === productId)) {
        toast({ variant: 'default', title: 'Already in Wishlist', description: 'This item is already in your wishlist.' });
        return;
    }

    const newItem: WishlistItem = {
      id: productId,
      productId,
      userId: user.uid,
      addedAt: Date.now(),
    };

    updateWishlist([...wishlist, newItem]);
    toast({ title: 'Added to Wishlist', description: 'The item has been added to your wishlist.' });
  }, [wishlist, user, userWishlistKey, toast]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in.' });
        return;
    }
    const newWishlist = wishlist.filter(item => item.productId !== productId);
    updateWishlist(newWishlist);
    toast({ title: 'Removed from Wishlist', description: 'The item has been removed from your wishlist.' });
  }, [wishlist, user, userWishlistKey, toast]);
  
  const isInWishlist = useCallback((productId: string) => {
      return !!wishlist?.some(item => item.productId === productId);
  }, [wishlist]);

  const value = useMemo(() => ({
    wishlist: wishlist || [],
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  }), [wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

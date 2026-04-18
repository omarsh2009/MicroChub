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
    id: string;
    productId: string;
    userId: string;
    addedAt: number;
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

  const userWishlistKey = useMemo(() => (user ? `${WISHLIST_KEY}-${user.uid}` : null), [user]);

  useEffect(() => {
    if (!userWishlistKey) {
      setLoading(false);
      setWishlist([]);
      return;
    }

    setLoading(true);
    try {
      const storedWishlist = localStorage.getItem(userWishlistKey);
      setWishlist(storedWishlist ? JSON.parse(storedWishlist) : []);
    } catch (error) {
      console.error("Failed to load wishlist from localStorage", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [userWishlistKey]);

  useEffect(() => {
    if (userWishlistKey && !loading) {
      try {
        localStorage.setItem(userWishlistKey, JSON.stringify(wishlist));
      } catch (error) {
        console.error("Failed to save wishlist to localStorage", error);
      }
    }
  }, [wishlist, userWishlistKey, loading]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in.' });
        return;
    }
    
    setWishlist(prevWishlist => {
        if (prevWishlist.some(item => item.productId === productId)) {
            toast({ variant: 'default', title: 'Already in Wishlist' });
            return prevWishlist;
        }

        const newItem: WishlistItem = {
            id: productId,
            productId,
            userId: user.uid,
            addedAt: Date.now(),
        };
        
        toast({ title: 'Added to Wishlist' });
        return [...prevWishlist, newItem];
    });
  }, [user, toast]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in.' });
        return;
    }
    setWishlist(prevWishlist => prevWishlist.filter(item => item.productId !== productId));
    toast({ title: 'Removed from Wishlist' });
  }, [user, toast]);
  
  const isInWishlist = useCallback((productId: string) => {
      return wishlist.some(item => item.productId === productId);
  }, [wishlist]);

  const value = useMemo(() => ({
    wishlist,
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

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
import { getWishlist, addToWishlist as addService, removeFromWishlist as removeService } from '@/lib/services/wishlist';

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


export function WishlistProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const user = useUser();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const loadWishlist = async () => {
        setLoading(true);
        try {
            const userWishlist = await getWishlist(user.uid);
            if(isMounted) {
                setWishlist(userWishlist);
            }
        } catch (error) {
            console.error("Failed to load wishlist", error);
            toast({ variant: 'destructive', title: 'Could not load wishlist' });
        } finally {
            if(isMounted) {
                setLoading(false);
            }
        }
    };
    
    loadWishlist();

    return () => { isMounted = false; }
  }, [user, toast]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in.' });
        return;
    }
    
    if (wishlist.some(item => item.productId === productId)) {
        return; // Already in wishlist
    }

    try {
        const newItem = await addService(user.uid, productId);
        setWishlist(prev => [...prev, newItem]);
        toast({ title: 'Added to Wishlist' });
    } catch(error) {
        console.error("Failed to add to wishlist", error);
        toast({ variant: 'destructive', title: 'Could not add to wishlist' });
    }
  }, [user, wishlist, toast]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in.' });
        return;
    }
    try {
        await removeService(user.uid, productId);
        setWishlist(prev => prev.filter(item => item.productId !== productId));
        toast({ title: 'Removed from Wishlist' });
    } catch (error) {
        console.error("Failed to remove from wishlist", error);
        toast({ variant: 'destructive', title: 'Could not remove from wishlist' });
    }
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

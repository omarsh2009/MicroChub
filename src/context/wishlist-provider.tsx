
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
import type { WishlistItem } from '@/lib/types';


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
        const { data, error } = await getWishlist();
        if (isMounted) {
            if (error) {
                console.error("Failed to load wishlist", error.message);
                toast({ variant: 'destructive', title: 'Could not load wishlist' });
            } else {
                setWishlist(data || []);
            }
            setLoading(false);
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

    const { data, error } = await addService(productId);
    if(error){
        console.error("Failed to add to wishlist", error.message);
        toast({ variant: 'destructive', title: 'Could not add to wishlist' });
    } else if (data) {
        setWishlist(prev => [...prev, data]);
        toast({ title: 'Added to Wishlist' });
    }
  }, [user, wishlist, toast]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in.' });
        return;
    }
    const { error } = await removeService(productId);

    if (error) {
        console.error("Failed to remove from wishlist", error.message);
        toast({ variant: 'destructive', title: 'Could not remove from wishlist' });
    } else {
        setWishlist(prev => prev.filter(item => item.productId !== productId));
        toast({ title: 'Removed from Wishlist' });
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

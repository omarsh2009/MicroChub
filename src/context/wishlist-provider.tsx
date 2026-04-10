'use client';

import {
  createContext,
  useCallback,
  useMemo,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export interface WishlistItem {
    id: string;
    productId: string;
    addedAt: {
        seconds: number;
        nanoseconds: number;
    };
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const user = useUser();
  const firestore = useFirestore();

  const wishlistCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'wishlist_items');
  }, [user, firestore]);

  const { data: wishlist, loading } = useCollection<WishlistItem>(wishlistCollectionRef);

  const addToWishlist = useCallback(async (productId: string) => {
    if (!wishlistCollectionRef) {
        toast({ variant: 'destructive', title: 'You must be logged in.' });
        return;
    }

    // Check if item already exists
    const q = query(wishlistCollectionRef, where("productId", "==", productId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        toast({ variant: 'default', title: 'Already in Wishlist', description: 'This item is already in your wishlist.' });
        return;
    }

    try {
        await addDoc(wishlistCollectionRef, {
            productId,
            addedAt: serverTimestamp()
        });
        toast({ title: 'Added to Wishlist', description: 'The item has been added to your wishlist.' });
    } catch (error: any) {
        console.error("Error adding to wishlist:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add item to wishlist.' });
    }
  }, [wishlistCollectionRef, toast]);

  const removeFromWishlist = useCallback(async (productId: string) => {
     if (!wishlistCollectionRef) {
        toast({ variant: 'destructive', title: 'You must be logged in.' });
        return;
    }

    try {
        const q = query(wishlistCollectionRef, where("productId", "==", productId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn("Item not found in wishlist to remove.");
            return;
        }
        
        const docToDelete = querySnapshot.docs[0];
        await deleteDoc(doc(wishlistCollectionRef, docToDelete.id));

        toast({ title: 'Removed from Wishlist', description: 'The item has been removed from your wishlist.' });
    } catch (error: any) {
        console.error("Error removing from wishlist:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not remove item from wishlist.' });
    }
  }, [wishlistCollectionRef, toast]);
  
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

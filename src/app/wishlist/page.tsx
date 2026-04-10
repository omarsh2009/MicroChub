'use client';

import Link from 'next/link';
import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, HeartCrack } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/product-card';

export default function WishlistPage() {
  const user = useUser();
  const { wishlist, loading: wishlistLoading } = useWishlist();

  if (user === undefined || wishlistLoading) {
    return (
      <div className="container flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">Please log in to view your wishlist.</p>
        <Button asChild>
          <Link href="/login?redirect=/wishlist">Login</Link>
        </Button>
      </div>
    );
  }

  const wishlistedProducts = wishlist
    .map(item => products.find(p => p.id === item.productId))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);


  return (
    <div className="container py-12 px-4 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">My Wishlist</h1>
      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      ) : (
        <Card className="text-center py-20">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
              <HeartCrack className="w-12 h-12 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-semibold mb-2">Your Wishlist is Empty</h2>
            <p className="text-muted-foreground mb-6">
              You haven't added any items yet. Start exploring to find products you love!
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

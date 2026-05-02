'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartCrack } from 'lucide-react';
import type { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { useAppContext } from '@/context/app-provider';

export function WishlistClientPage({ products, categories }: { products: Product[], categories: Category[]}) {
  const { currentUser } = useAppContext();
  
  const wishlistProducts = products.filter(p => currentUser?.wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
      return (
        <div className="container py-12 px-4 md:px-6">
          <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">My Wishlist</h1>
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
        </div>
      );
  }

  return (
    <div className="container py-12 px-4 md:px-6">
      <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistProducts.map(product => (
            <ProductCard key={product.id} product={product} categories={categories} />
        ))}
      </div>
    </div>
  );
}

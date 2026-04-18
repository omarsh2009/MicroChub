import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartCrack } from 'lucide-react';
import { getProducts } from '@/lib/services/products';
import { getCategories } from '@/lib/services/categories';
import { WishlistClientPage } from './client';

export default async function WishlistPage() {
    const products = await getProducts();
    const categories = await getCategories();

    if (products.length === 0) {
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
        )
    }

    return <WishlistClientPage products={products} categories={categories} />;
}

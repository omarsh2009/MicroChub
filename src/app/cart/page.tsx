'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function CartPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">Your Cart</h1>

            <Card className="text-center py-20">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <ShoppingCart className="w-12 h-12 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Button asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

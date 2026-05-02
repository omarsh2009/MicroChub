'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/context/app-provider';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
    const { cart, removeFromCart, updateCartQuantity } = useAppContext();
    const { toast } = useToast();

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleRemove = (id: string, name: string) => {
        removeFromCart(id);
        toast({ title: 'Removed', description: `${name} removed from cart.` });
    };

    const handleQuantity = (id: string, quantity: number, max?: number) => {
        if (quantity < 1) return;
        if (max && quantity > max) return;
        updateCartQuantity(id, quantity);
    };

    if (cart.length === 0) {
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

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">Your Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex gap-4 sm:gap-6">
                                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-md overflow-hidden bg-muted">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-lg sm:text-xl">
                                                    <Link href={`/products/${item.slug}`} className="hover:text-primary transition-colors">
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                                <p className="font-bold text-lg">EGP {(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                            <div className="text-xs text-muted-foreground space-y-0.5">
                                                {Object.entries(item.configuration).map(([key, val]) => (
                                                    <p key={key}><span className="font-medium text-foreground">{key}:</span> {Array.isArray(val) ? val.join(', ') : val}</p>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantity(item.id, item.quantity - 1)}>
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantity(item.id, item.quantity + 1)}>
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleRemove(item.id, item.name)}>
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>EGP {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Estimated Shipping</span>
                                <span className="text-sm">Calculated at next step</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>EGP {subtotal.toLocaleString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full" size="lg">
                                <Link href="/checkout">
                                    Proceed to Checkout
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

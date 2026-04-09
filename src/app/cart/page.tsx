'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
    const { cart, removeFromCart, updateItemQuantity, totalPrice, itemCount } = useCart();

    const renderConfiguration = (config: Record<string, string | string[]>) => {
        const entries = Object.entries(config);
        if (entries.length === 0) return null;
        
        return entries.map(([groupName, option]) => (
            <div key={groupName} className="text-xs text-muted-foreground">
                <span className="font-semibold">{groupName}:</span>{' '}
                {Array.isArray(option) ? option.join(', ') : option}
            </div>
        ));
    };

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter mb-8">Your Cart</h1>

            {cart.length === 0 ? (
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
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <Card key={item.id} className="flex flex-col md:flex-row items-center gap-4 p-4">
                                <Image 
                                    src={item.image || "https://picsum.photos/seed/placeholder/100/100"} 
                                    alt={item.name} 
                                    width={100} 
                                    height={100} 
                                    className="rounded-md aspect-square object-cover"
                                />
                                <div className="flex-grow">
                                    <Link href={`/products/${item.slug}`} className="font-semibold text-lg hover:underline">{item.name}</Link>
                                    {renderConfiguration(item.configuration)}
                                </div>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <Input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                                        className="w-20"
                                        aria-label={`${item.name} quantity`}
                                    />
                                    <p className="font-semibold w-24 text-right">EGP {(item.price * item.quantity).toLocaleString()}</p>
                                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>
                                        <Trash2 className="h-5 w-5 text-destructive" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                    
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span>EGP {totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-muted-foreground">Calculated at checkout</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>EGP {totalPrice.toLocaleString()}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" size="lg">
                                    <Link href="/checkout">Proceed to Checkout</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
